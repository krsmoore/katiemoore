import {CATALOG} from './catalog.mjs';
import {mailTransport} from './mail.mjs';
import {token,readToken,verifySignature} from './security.mjs';
export const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
export async function purchased(stripe,id,mode,catalog=CATALOG){
 if(!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id||''))return null;
 const s=await stripe.checkout.sessions.retrieve(id);
 const p=catalog[s.metadata?.product_key];
 if(!p||!p.amount||s.livemode!==(mode==='live')||s.mode!=='payment'||s.metadata?.site!=='katiemoore'||s.metadata?.fulfillment!=='digital-v1'||s.payment_link!==p[mode+'Link'])return null;
 if(s.status!=='complete'||s.payment_status!=='paid')return {pending:true};
 const items=await stripe.checkout.sessions.listLineItems(id,{limit:2});
 if(items.has_more||items.data.length!==1)return null;
 const line=items.data[0];
 if(line.quantity!==1||line.price?.id!==p[mode+'Price']||line.price?.currency!=='usd'||line.price?.unit_amount!==p.amount||s.currency!=='usd'||s.amount_subtotal!==p.amount||s.amount_total!==p.amount)return null;
 return {session:s,product:p,key:s.metadata.product_key};
}
export function createHandler(getStripe,catalog=CATALOG){return async function(request,env){
 const url=new URL(request.url),mode=url.searchParams.get('mode')==='test'?'test':'live';
 const cors={'Access-Control-Allow-Origin':env.SITE_ORIGIN,'Vary':'Origin'};
 if(mode==='live'&&env.LIVE_ENABLED!=='true')return json({error:'Live sales are not enabled yet.'},503,cors);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors,'Access-Control-Allow-Methods':'GET, OPTIONS'}});
 try{
  if(url.pathname==='/free'&&request.method==='GET'){
   const p=catalog[url.searchParams.get('key')||'find_examples'];
   if(!p||p.amount!==0)return json({error:'Free download not found'},404,cors);
   return pdf(env,p);
  }
  if(url.pathname==='/catalog-status'&&request.method==='GET'&&mode==='test'){
   const entries=await Promise.all(Object.entries(catalog).map(async([key,p])=>{const head=await env.PDFS.head(p.file);return {key,ready:!!head&&head.size===p.bytes&&head.etag===p.md5};}));
   return json({products:entries},200,cors);
  }
  if(url.pathname==='/verify'&&request.method==='GET'){
   if(request.headers.get('Origin')!==env.SITE_ORIGIN)return json({error:'Origin not allowed'},403,cors);
   const order=await purchased(getStripe(env,mode),url.searchParams.get('session_id'),mode,catalog);
   if(!order)return json({error:'Purchase not found'},404,cors);
   if(order.pending)return json({status:'pending'},202,cors);
   const exp=Date.now()+7*86400000,t=await token(env.DOWNLOAD_SIGNING_SECRET,{sid:order.session.id,key:order.key,mode,exp});
   return json({status:'paid',title:order.product.title,pages:order.product.pages,downloadUrl:url.origin+'/file?mode='+mode+'&token='+encodeURIComponent(t)},200,cors);
  }
  if(url.pathname==='/file'&&request.method==='GET'){
   const c=await readToken(env.DOWNLOAD_SIGNING_SECRET,url.searchParams.get('token'));
   if(!c||c.mode!==mode)return json({error:'This download link is invalid or expired.'},403);
   const o=await purchased(getStripe(env,mode),c.sid,mode,catalog);
   if(!o||o.pending||o.key!==c.key)return json({error:'Purchase not available'},403);
   return pdf(env,o.product);
  }
  if(url.pathname==='/webhook'&&request.method==='POST'){
   if(Number(request.headers.get('Content-Length')||0)>1048576)return json({error:'Too large'},413);
   const raw=await request.text();if(raw.length>1048576)return json({error:'Too large'},413);
   if(!await verifySignature(env[mode==='test'?'STRIPE_TEST_WEBHOOK_SECRET':'STRIPE_WEBHOOK_SECRET'],raw,request.headers.get('stripe-signature')))return json({error:'Invalid signature'},400);
   const event=JSON.parse(raw);
   if(event.livemode!==(mode==='live'))return json({error:'Wrong environment'},400);
   if(!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type))return json({received:true});
   const id=event.data?.object?.id,order=await purchased(getStripe(env,mode),id,mode,catalog);
   if(!order||order.pending)return json({received:true});
   const stub=env.ORDERS.get(env.ORDERS.idFromName(mode+':'+id));
   const response=await stub.fetch('https://internal/fulfill',{method:'POST',body:JSON.stringify({mode,sessionId:id,key:order.key,email:order.session.customer_details?.email||order.session.customer_email,apiOrigin:url.origin})});
   if(!response.ok)return json({error:'Please retry fulfillment'},503);
   return json({received:true});
  }
  return json({error:'Not found'},404,cors);
 }catch(error){
  if(error?.code==='resource_missing')return json({error:'Purchase not found'},404,cors);
  if(error?.type==='StripeAuthenticationError')return json({error:'Payment verification is not connected. Please contact Katie for help.'},503,cors);
  return json({error:'Delivery is temporarily unavailable. Please try again.'},503,cors);
 }
};}
async function pdf(env,product){const obj=await env.PDFS.get(product.file);if(!obj)return json({error:'File unavailable'},503);return new Response(obj.body,{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="'+product.file+'"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});}
export class OrderProcessor{
 constructor(ctx,env,send=fetch,catalog=CATALOG){this.ctx=ctx;this.env=env;this.send=mailTransport(env,send);this.catalog=catalog;}
 fetch(request){return this.ctx.blockConcurrencyWhile(async()=>{const incoming=await request.json();let r=await this.ctx.storage.get('order');if(r?.sent||r?.attention)return json({received:true});if(!r){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(incoming.email||''))return json({error:'Email missing'},503);r={...incoming,created:Date.now(),attempts:0};await this.ctx.storage.put('order',r);}await this.deliver(r);return json({queued:true});});}
 async deliver(r){
  if(r.sent||r.attention)return;
  const retryWindow=this.env.MAIL_BRIDGE_URL?6*86400000:22*3600000;
  if(Date.now()-r.created>retryWindow){r.attention=true;await this.ctx.storage.put('order',r);return;}
  await this.ctx.storage.setAlarm(Date.now()+5*60000);
  try{
   if(!this.env.MAIL_BRIDGE_URL&&(!this.env.EMAIL_API_KEY||!this.env.EMAIL_FROM))throw Error('Email not connected');
   r.token ||= await token(this.env.DOWNLOAD_SIGNING_SECRET,{sid:r.sessionId,key:r.key,mode:r.mode,exp:r.created+7*86400000});await this.ctx.storage.put('order',r);
   const link=this.env.SITE_BASE+'/download.html?mode='+r.mode+'&token='+encodeURIComponent(r.token),p=this.catalog[r.key];
   const res=await this.send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+this.env.EMAIL_API_KEY,'Content-Type':'application/json','Idempotency-Key':'download-'+r.mode+'-'+r.sessionId},body:JSON.stringify({from:this.env.EMAIL_FROM,to:[r.email],subject:(r.mode==='test'?'TEST — ':'')+'Your '+p.title+' PDF',html:'<div style="background:#f6f2e9;color:#201820;padding:32px;font:16px/1.6 Arial"><p style="color:#702f3a;letter-spacing:2px">KATIE MOORE</p><h1 style="font-family:Georgia">Your '+p.title+' is ready.</h1><p>Thank you for your order. Download your '+p.pages+'-page printable PDF below.</p><p><a style="background:#702f3a;color:white;padding:14px 24px;display:inline-block" href="'+link+'">Download your PDF</a></p><p>This private link is available for seven days. US Letter PDF. Print and reuse.</p></div>',text:'Your '+p.title+' is ready: '+link+'\nThis link expires in seven days.'})});
   if(!res.ok)throw Error('Email send failed');
   const result=await res.json();r.sent=true;r.emailId=result.id;await this.ctx.storage.put('order',r);await this.ctx.storage.deleteAlarm();
  }catch(error){r.attempts++;r.attention=!!error.needsReview;await this.ctx.storage.put('order',r);if(r.attention)await this.ctx.storage.deleteAlarm();else await this.ctx.storage.setAlarm(Date.now()+Math.min(60,5*2**Math.min(r.attempts,4))*60000);}
 }
 alarm(){return this.ctx.blockConcurrencyWhile(async()=>{const r=await this.ctx.storage.get('order');if(r)await this.deliver(r);});}
}

