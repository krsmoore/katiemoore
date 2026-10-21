import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler,OrderProcessor,purchased} from '../src/core.mjs';
import {CATALOG} from '../src/catalog.mjs';
import {token,readToken,mac} from '../src/security.mjs';
const p=CATALOG.story_bank;
const session={id:'cs_test_abc123',livemode:false,mode:'payment',status:'complete',payment_status:'paid',payment_link:p.testLink,metadata:{site:'katiemoore',fulfillment:'digital-v1',product_key:'story_bank'},currency:'usd',amount_subtotal:700,amount_total:700,customer_details:{email:'buyer@example.com'}};
function setup(overrides={}){
 const s=structuredClone({...session,...overrides}),sent=[],files=[];
 const stripe={checkout:{sessions:{retrieve:async()=>s,listLineItems:async()=>({has_more:false,data:[{quantity:1,price:{id:p.testPrice,currency:'usd',unit_amount:700}}]})}}};
 const records=new Map();let alarm;
 const storage={get:async k=>records.get(k),put:async(k,v)=>records.set(k,structuredClone(v)),setAlarm:async v=>alarm=v,deleteAlarm:async()=>alarm=null};
 const env={LIVE_ENABLED:'false',SITE_ORIGIN:'https://shop.example',SITE_BASE:'https://shop.example',DOWNLOAD_SIGNING_SECRET:'test-only-signing-secret',STRIPE_TEST_WEBHOOK_SECRET:'test-only-webhook-secret',EMAIL_API_KEY:'test-only-email-key',EMAIL_FROM:'Katie <test@example.com>',PDFS:{get:async key=>{files.push(key);return {body:new TextEncoder().encode('%PDF-test')};}}};
 const order=new OrderProcessor({storage,blockConcurrencyWhile:fn=>fn()},env,async(url,opts)=>{sent.push(JSON.parse(opts.body));return Response.json({id:'email_1'});});
 env.ORDERS={idFromName:x=>x,get:()=>({fetch:(url,opts)=>order.fetch(new Request(url,opts))})};
 return {s,sent,files,stripe,env,order,records,handler:createHandler(()=>stripe)};
}
const req=(path,init={})=>new Request('https://api.example'+path,{...init,headers:{Origin:'https://shop.example',...init.headers}});
async function webhook(x,type='checkout.session.completed',signature=true){const raw=JSON.stringify({id:'evt_test',livemode:false,type,data:{object:{id:x.s.id}}}),t=Math.floor(Date.now()/1000);return x.handler(req('/webhook?mode=test',{method:'POST',body:raw,headers:{'stripe-signature':'t='+t+',v1='+(signature?await mac(x.env.STRIPE_TEST_WEBHOOK_SECRET,t+'.'+raw):'bad')}}),x.env);}
test('verified paid session delivers only its mapped private PDF',async()=>{const x=setup();const r=await x.handler(req('/verify?mode=test&session_id=cs_test_abc123'),x.env);assert.equal(r.status,200);const data=await r.json();assert.equal(data.title,'Story Bank');const pdf=await x.handler(new Request(data.downloadUrl),x.env);assert.equal(pdf.status,200);assert.equal(pdf.headers.get('Content-Type'),'application/pdf');assert.deepEqual(x.files,['Story-Bank-Template.pdf']);});
test('pending payment has no download and no email until async success',async()=>{const x=setup({payment_status:'unpaid'});assert.equal((await x.handler(req('/verify?mode=test&session_id=cs_test_abc123'),x.env)).status,202);await webhook(x);assert.equal(x.sent.length,0);x.s.payment_status='paid';await webhook(x,'checkout.session.async_payment_succeeded');assert.equal(x.sent.length,1);});
test('duplicate and differently named success events fulfill once without return-page visit',async()=>{const x=setup();await webhook(x);await webhook(x);await webhook(x,'checkout.session.async_payment_succeeded');assert.equal(x.sent.length,1);assert.match(x.sent[0].html,/token=/);});
test('invalid webhook signature is rejected',async()=>{const x=setup();assert.equal((await webhook(x,undefined,false)).status,400);assert.equal(x.sent.length,0);});
test('unrecognized payment link, amount, mode and product never grant access',async()=>{for(const change of [{payment_link:'plink_wrong'},{amount_total:1},{livemode:true},{metadata:{...session.metadata,product_key:'complete_bundle'}}]){const x=setup(change);assert.equal(await purchased(x.stripe,x.s.id,'test'),null);}});
test('wrong price cannot be substituted using metadata',async()=>{const x=setup();x.stripe.checkout.sessions.listLineItems=async()=>({data:[{quantity:1,price:{id:'price_wrong',currency:'usd',unit_amount:700}}]});assert.equal(await purchased(x.stripe,x.s.id,'test'),null);});
test('expired, tampered and cross-product tokens are rejected',async()=>{const x=setup();const good=await token(x.env.DOWNLOAD_SIGNING_SECRET,{sid:x.s.id,key:'complete_bundle',mode:'test',exp:Date.now()+60000});assert.equal((await x.handler(req('/file?mode=test&token='+good),x.env)).status,403);assert.equal(await readToken(x.env.DOWNLOAD_SIGNING_SECRET,good+'x'),null);assert.equal(await readToken(x.env.DOWNLOAD_SIGNING_SECRET,await token(x.env.DOWNLOAD_SIGNING_SECRET,{exp:Date.now()-1})),null);});
test('live sales remain disabled',async()=>{const x=setup();assert.equal((await x.handler(req('/verify?session_id=cs_live_abc'),x.env)).status,503);});
test('email outage persists outbox and alarm retries it',async()=>{const x=setup();x.order.send=async()=>new Response('unavailable',{status:503});await webhook(x);assert.equal(x.records.get('order').sent,undefined);x.order.send=async()=>Response.json({id:'recovered'});await x.order.alarm();assert.equal(x.records.get('order').sent,true);});
test('free endpoint cannot choose a paid PDF',async()=>{const x=setup();await x.handler(req('/free?mode=test&product=complete_bundle'),x.env);assert.deepEqual(x.files,['Find-Your-Examples-Template.pdf']);});
