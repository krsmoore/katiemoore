import test from 'node:test';
import assert from 'node:assert/strict';
import {mailTransport} from '../src/mail.mjs';
import {mac} from '../src/security.mjs';

test('Gmail bridge signs recipient, message and stable delivery ID',async()=>{
 const env={MAIL_BRIDGE_URL:'https://example.test/exec',MAIL_BRIDGE_SECRET:'test-only-secret'};
 const transport=mailTransport(env,async(url,options)=>{
  assert.equal(url,env.MAIL_BRIDGE_URL);
  const body=JSON.parse(options.body);
  assert.equal(body.signature,await mac(env.MAIL_BRIDGE_SECRET,body.timestamp+'.'+body.payload));
  const msg=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(body.payload),x=>x.charCodeAt(0))));
  assert.equal(msg.subject,'Your PDF — ready');
  assert.equal(msg.to,'buyer@example.test');
  assert.equal(msg.id,'download-test-cs_test_example');
  assert(!options.body.includes('Bearer'));
  return Response.json({ok:true,id:msg.id});
 });
 const result=await transport('https://api.resend.com/emails',{headers:{'Idempotency-Key':'download-test-cs_test_example'},body:JSON.stringify({to:['buyer@example.test'],subject:'Your PDF — ready',text:'Private download',html:'<p>Private download</p>'})});
 assert.equal((await result.json()).id,'download-test-cs_test_example');
});

test('Gmail bridge never marks an ambiguous send as delivered',async()=>{
 const transport=mailTransport({MAIL_BRIDGE_URL:'https://example.test/exec',MAIL_BRIDGE_SECRET:'test'},async()=>Response.json({ok:false,needsReview:true}));
 await assert.rejects(()=>transport('',{headers:{'Idempotency-Key':'download-test-example'},body:JSON.stringify({to:['buyer@example.test']})}),/not confirmed/);
});
