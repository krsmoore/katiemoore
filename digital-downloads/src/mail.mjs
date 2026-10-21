import {mac} from './security.mjs';

// The Google web app sends mail as its owner; it never receives Stripe keys or PDFs.
export function mailTransport(env,send){return async (url,options)=>{
 if(!env.MAIL_BRIDGE_URL)return send(url,options);
 if(!env.MAIL_BRIDGE_SECRET)throw Error('Mail bridge not configured');
 const message=JSON.parse(options.body);
 const payload=btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify({
  id:options.headers['Idempotency-Key'],to:message.to[0],subject:message.subject,
  text:message.text,html:message.html
 }))));
 const timestamp=Date.now(),signature=await mac(env.MAIL_BRIDGE_SECRET,timestamp+'.'+payload);
 const response=await send(env.MAIL_BRIDGE_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({timestamp,payload,signature})});
 if(!response.ok)throw Error('Mail bridge unavailable');
 const result=await response.json();
 if(!result.ok)throw Error('Mail delivery not confirmed');
 return Response.json({id:result.id});
};}
