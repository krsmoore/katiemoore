import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
import {createHmac} from 'node:crypto';
const source=await fs.readFile(new URL('../gmail/Code.gs',import.meta.url),'utf8');
function setup(){
 const records=new Map([['MAIL_BRIDGE_SECRET','test-bridge-secret']]);let sends=0,quota=100,fail=false;
 const context=vm.createContext({
  ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>records.get(k),setProperty:(k,v)=>records.set(k,v)})},
  Utilities:{computeHmacSha256Signature:(text,key)=>Array.from(createHmac('sha256',key).update(text).digest()),base64Decode:s=>Buffer.from(s,'base64'),newBlob:b=>({getDataAsString:()=>b.toString('utf8')})},
  LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
  MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:()=>{sends++;if(fail)throw Error('Ambiguous send');}}
 });vm.runInContext(source,context);
 const message={id:'download-test-cs_test_example',to:'buyer@example.test',subject:'Your PDF',text:'Private link',html:'<p>Private link</p>'};
 const call=(overrides={})=>{
  const timestamp=Date.now(),payload=Buffer.from(JSON.stringify(message)).toString('base64');
  const signature=createHmac('sha256','test-bridge-secret').update(timestamp+'.'+payload).digest('hex');
  return JSON.parse(context.doPost({postData:{contents:JSON.stringify({timestamp,payload,signature,...overrides})}}).text);
 };
 return {call,records,get sends(){return sends;},set quota(x){quota=x;},set fail(x){fail=x;}};
}
test('actual Gmail script deduplicates signed delivery requests',()=>{
 const s=setup();assert.equal(s.call().ok,true);assert.equal(s.call().ok,true);assert.equal(s.sends,1);
});
test('actual Gmail script rejects unsigned and expired requests',()=>{
 const s=setup();assert.equal(s.call({signature:'invalid'}).ok,false);assert.equal(s.call({timestamp:Date.now()-600000}).ok,false);assert.equal(s.sends,0);
});
test('Gmail quota waits and ambiguous sending never sends twice',()=>{
 const s=setup();s.quota=0;assert.equal(s.call().retry,true);assert.equal(s.sends,0);
 s.quota=100;s.fail=true;assert.throws(()=>s.call(),/Ambiguous send/);
 s.fail=false;assert.equal(s.call().needsReview,true);assert.equal(s.sends,1);
});
