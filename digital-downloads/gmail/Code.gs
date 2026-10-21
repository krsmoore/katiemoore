// Deploy as a web app that executes as you. Save MAIL_BRIDGE_SECRET as a Script Property.
// This uses only MailApp's send-mail scope, not access to your inbox.
function doPost(e) {
  const out = value => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
  const props = PropertiesService.getScriptProperties();
  let input;
  try { input = JSON.parse(e.postData.contents); } catch (_) { return out({ok:false}); }
  const secret = props.getProperty('MAIL_BRIDGE_SECRET');
  if (!secret || !/^\d+$/.test(String(input.timestamp)) || Math.abs(Date.now()-input.timestamp)>300000 || typeof input.payload!=='string' || input.payload.length>20000) return out({ok:false});
  const expected=Utilities.computeHmacSha256Signature(input.timestamp+'.'+input.payload,secret).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
  if(typeof input.signature!=='string'||input.signature.length!==expected.length)return out({ok:false});
  let diff=0;for(let i=0;i<expected.length;i++)diff|=input.signature.charCodeAt(i)^expected.charCodeAt(i);if(diff)return out({ok:false});
  let msg;try{msg=JSON.parse(Utilities.newBlob(Utilities.base64Decode(input.payload)).getDataAsString());}catch(_){return out({ok:false});}
  if(!/^[a-zA-Z0-9_-]{8,200}$/.test(msg.id)||!/^\S+@\S+\.\S+$/.test(msg.to)||!msg.subject||!msg.text||!msg.html)return out({ok:false});
  const lock=LockService.getScriptLock();lock.waitLock(20000);
  try {
    const key='delivery_'+msg.id,state=props.getProperty(key);
    if(state==='sent')return out({ok:true,id:msg.id});
    // A crash during send is ambiguous. Never send a second copy automatically.
    if(state==='sending')return out({ok:false,needsReview:true});
    if(MailApp.getRemainingDailyQuota()<1)return out({ok:false,retry:true});
    props.setProperty(key,'sending');
    MailApp.sendEmail({to:msg.to,subject:msg.subject,body:msg.text,htmlBody:msg.html,name:'Katie Moore'});
    props.setProperty(key,'sent');return out({ok:true,id:msg.id});
  } finally {lock.releaseLock();}
}
function authorizeMail(){ return MailApp.getRemainingDailyQuota(); }
