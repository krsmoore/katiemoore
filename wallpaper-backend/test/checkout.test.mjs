import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../src/handler.mjs';
const reference='VB-12345678-1234-4123-8123-123456789abc';
const env={SITE_ORIGIN:'https://krsmoore.github.io',SITE_BASE:'https://krsmoore.github.io/katiemoore',ALLOW_SANDBOX:'true',STRIPE_PUBLISHABLE_KEY:'pk_live_test',STRIPE_WEBHOOK_SECRET:'whsec_test'};
const request=(path,body)=>new Request('https://backend.example'+path,{method:body?'POST':'GET',headers:{Origin:env.SITE_ORIGIN,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
test('rejects other origins without creating Stripe sessions',async()=>{
 const handle=createHandler(()=>{throw Error('must not create client')});
 const res=await handle(new Request('https://backend.example/config',{headers:{Origin:'https://other.example'}}),env);
 assert.equal(res.status,403);
});
test('charges the server-defined price even when client submits another amount',async()=>{
 let created;
 const handle=createHandler(()=>({checkout:{sessions:{create:async(params,opts)=>{created={params,opts};return{id:'cs_live_test',client_secret:'testsecret'};}}}}));
 const res=await handle(request('/checkout-session',{product:'vision_board_wallpaper',reference,email:'test@example.com',amount:1,price:'attacker-price'}),env);
 assert.equal(res.status,200);
 assert.equal(created.params.line_items[0].price,'price_1UQI1p37dVOsPr0Aza6gPH0r');
 assert.equal(created.params.line_items[0].quantity,1);
 assert.equal(created.params.ui_mode,'embedded_page');
 assert.equal(created.params.payment_method_types,undefined);
 assert.equal(created.opts.idempotencyKey,'live:wallpaper:'+reference);
 assert.match(created.params.return_url,/vision-board\.html\?pay=VB-/);
});
test('invalid product and reference are rejected before creating sessions',async()=>{
 const handle=createHandler(()=>{throw Error('must not create client')});
 const res=await handle(request('/checkout-session',{product:'missing',reference,email:'test@example.com'}),env);
 assert.equal(res.status,400);
});
test('session status does not disclose unrelated orders',async()=>{
 const handle=createHandler(()=>({checkout:{sessions:{retrieve:async()=>({metadata:{site:'katiemoore',product_key:'vision_board_wallpaper'},client_reference_id:'different'})}}}));
 const res=await handle(request('/session-status?session_id=cs_live_test&reference='+reference),env);
 assert.equal(res.status,404);
});
function webhookHarness(event,invalid=false){
 const writes=[];const saved=new Map();
 const kv={get:async key=>saved.get(key)||null,put:async(key,value)=>{writes.push(JSON.parse(value));saved.set(key,JSON.parse(value));}};
 const handle=createHandler(()=>({webhooks:{constructEventAsync:async()=>{if(invalid)throw Error('bad signature');return event;}}}));
 const send=()=>handle(new Request('https://backend.example/webhook',{method:'POST',body:'event',headers:{'stripe-signature':'test'}}),{...env,ORDER_EVENTS:kv});
 return{writes,send,event};
}
const paidEvent=()=>({id:'evt_paid',type:'checkout.session.completed',created:1,data:{object:{id:'cs_live_test',payment_status:'paid',currency:'usd',amount_total:1500,client_reference_id:reference,metadata:{site:'katiemoore',product_key:'vision_board_wallpaper'}}}});
test('rejects webhook signatures before recording an order',async()=>{
 const h=webhookHarness(paidEvent(),true);assert.equal((await h.send()).status,400);assert.equal(h.writes.length,0);
});
test('unpaid completed sessions are not treated as paid orders',async()=>{
 const event=paidEvent();event.data.object.payment_status='unpaid';const h=webhookHarness(event);assert.equal((await h.send()).status,200);assert.equal(h.writes.length,0);
});
test('verified payments are recorded and later failed events do not downgrade them',async()=>{
 const event=paidEvent(),h=webhookHarness(event);assert.equal((await h.send()).status,200);assert.equal(h.writes[0].paymentStatus,'paid');
 event.type='checkout.session.async_payment_failed';event.data.object.payment_status='unpaid';await h.send();assert.equal(h.writes.length,1);
});
test('asynchronous success is recorded after payment succeeds',async()=>{
 const event=paidEvent();event.type='checkout.session.async_payment_succeeded';const h=webhookHarness(event);await h.send();assert.equal(h.writes[0].paymentStatus,'paid');
});