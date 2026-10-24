export const PRODUCTS = {
  resume_review: {amount:10000, live:null, test:'price_1UUCoj7V1kfjGKUW5Hc8qolL', page:'resume-review.html', prefix:'RR'},
  vision_board_wallpaper: {amount:1500, live:'price_1UQI1p37dVOsPr0Aza6gPH0r', test:'price_1UKomi7V1kfjGKUWsIZhT4fj', page:'vision-board.html', prefix:'VB'},
  looking_forward_wallpaper: {amount:1000, live:'price_1UQI1q37dVOsPr0ATbRRu8FB', test:'price_1UQHcI7V1kfjGKUWPPmyZajv', page:'looking-forward.html', prefix:'LF'}
};
const REFERENCE=/^(VB|LF|RR)-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function json(data,status=200,headers={}) { return Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}}); }
export function createHandler(getStripe, cryptoProvider) {
  return async function fetch(request,env) {
    const url=new URL(request.url);
    const mode=url.searchParams.get('mode')==='test'?'test':'live';
    const isWebhook=url.pathname==='/webhook';
    const origin=request.headers.get('Origin');
    const cors={'Access-Control-Allow-Origin':env.SITE_ORIGIN,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'};
    if(mode==='test'&&env.ALLOW_SANDBOX!=='true')return json({error:'Sandbox unavailable'},404);
    if(!isWebhook&&origin!==env.SITE_ORIGIN)return json({error:'Origin not allowed'},403);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
    try {
      if(url.pathname==='/submit'&&request.method==='POST'){
        if(!env.WALLPAPER_ORDERS)return json({error:'Combined checkout is not configured yet'},503,cors);
        if(Number(request.headers.get('Content-Length')||0)>10100000)return json({error:'Please keep photos under 10 MB combined.'},413,cors);
        const raw=await request.arrayBuffer();if(raw.byteLength>10100000)return json({error:'Please keep photos under 10 MB combined.'},413,cors);
        const probe=await new Request(request.url,{method:'POST',headers:{'Content-Type':request.headers.get('Content-Type')},body:raw}).formData(),reference=probe.get('reference'),product=PRODUCTS[probe.get('product')];
        if(!product||!REFERENCE.test(reference||'')||!reference.startsWith(product.prefix+'-'))return json({error:'Invalid questionnaire'},400,cors);
        const stub=env.WALLPAPER_ORDERS.get(env.WALLPAPER_ORDERS.idFromName(mode+':'+reference));
        const result=await stub.fetch(new Request('https://order/stage?mode='+mode,{method:'POST',headers:{'Content-Type':request.headers.get('Content-Type')},body:raw}));
        return new Response(result.body,{status:result.status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
      }
      if(['/resume','/cancel'].includes(url.pathname)){
        const id=url.searchParams.get('session_id'),reference=url.searchParams.get('reference');
        if(!id||!/^cs_(live|test)_[A-Za-z0-9]+$/.test(id)||!REFERENCE.test(reference||''))return json({error:'Invalid session'},400,cors);
        const stripe=getStripe(env,mode),session=await stripe.checkout.sessions.retrieve(id);
        if(session.metadata?.site!=='katiemoore'||session.metadata?.brief_version!=='2'||session.client_reference_id!==reference)return json({error:'Session not found'},404,cors);
        if(url.pathname==='/cancel'&&request.method==='POST'){
          if(session.status==='open')await stripe.checkout.sessions.expire(id);
          return json({status:session.status==='open'?'expired':session.status,paymentStatus:session.payment_status},200,cors);
        }
        if(url.pathname==='/resume'&&request.method==='GET')return json({clientSecret:session.client_secret,sessionId:session.id},200,cors);
        return json({error:'Method not allowed'},405,cors);
      }
      if(url.pathname==='/config'&&request.method==='GET'){
        const publishableKey=mode==='test'?env.STRIPE_TEST_PUBLISHABLE_KEY:env.STRIPE_PUBLISHABLE_KEY;
        if(!publishableKey)return json({error:'Checkout is not configured yet'},503,cors);
        return json({publishableKey},200,cors);
      }
      if(url.pathname==='/checkout-session'&&request.method==='POST'){
        const bodyText=await request.text();
        if(bodyText.length>4096)return json({error:'Request too large'},413,cors);
        let body;try{body=JSON.parse(bodyText);}catch{return json({error:'Invalid request'},400,cors);}
        const product=PRODUCTS[body.product];
        if(body.product==='resume_review')return json({error:'Please complete the resume review form first.'},400,cors);
        if(!product||!REFERENCE.test(body.reference)||!body.reference.startsWith(product.prefix+'-')||typeof body.email!=='string'||body.email.length>254||!EMAIL.test(body.email))return json({error:'Invalid order details'},400,cors);
        const stripe=getStripe(env,mode);
        const session=await stripe.checkout.sessions.create({
          mode:'payment',ui_mode:'embedded_page',redirect_on_completion:'if_required',
          line_items:[{price:product[mode],quantity:1}],customer_email:body.email,
          client_reference_id:body.reference,
          metadata:{site:'katiemoore',product_key:body.product,order_reference:body.reference},
          integration_identifier:'wallpaper-embedded-'+body.reference.slice(-8).replace(/[0-9]/g,n=>String.fromCharCode(103+Number(n))),
          return_url:env.SITE_BASE+'/'+product.page+'?pay='+encodeURIComponent(body.reference)+(mode==='test'?'&checkout=test':'')+'&session_id={CHECKOUT_SESSION_ID}'
        },{idempotencyKey:mode+':wallpaper:'+body.reference});
        return json({clientSecret:session.client_secret,sessionId:session.id},200,cors);
      }
      if(url.pathname==='/session-status'&&request.method==='GET'){
        const id=url.searchParams.get('session_id'),reference=url.searchParams.get('reference');
        if(!id||!/^cs_(live|test)_[A-Za-z0-9]+$/.test(id)||!REFERENCE.test(reference||''))return json({error:'Invalid session'},400,cors);
        const session=await getStripe(env,mode).checkout.sessions.retrieve(id);
        if(session.metadata?.site!=='katiemoore'||session.client_reference_id!==reference||!PRODUCTS[session.metadata.product_key])return json({error:'Session not found'},404,cors);
        let deliveryStatus,deliveryError;
        if(session.metadata?.brief_version==='2'&&env.WALLPAPER_ORDERS){
          const stub=env.WALLPAPER_ORDERS.get(env.WALLPAPER_ORDERS.idFromName(mode+':'+reference));
          const response=await stub.fetch('https://order/status?session_id='+id);if(response.ok){const delivery=await response.json();deliveryStatus=delivery.deliveryStatus;deliveryError=delivery.deliveryError;}
        }
        return json({status:session.status,paymentStatus:session.payment_status,reference,amount:session.amount_total,currency:session.currency,deliveryStatus,...(mode==='test'?{deliveryError}:{})},200,cors);
      }
      if(isWebhook&&request.method==='POST'){
        const signature=request.headers.get('stripe-signature');
        const secret=mode==='test'?env.STRIPE_TEST_WEBHOOK_SECRET:env.STRIPE_WEBHOOK_SECRET;
        if(!secret||!env.ORDER_EVENTS)return json({error:'Webhook not configured'},503);
        let event;try{event=await getStripe(env,mode).webhooks.constructEventAsync(await request.text(),signature,secret,undefined,cryptoProvider);}catch{return json({error:'Invalid signature'},400);}
        const kinds=['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed'];
        if(!kinds.includes(event.type))return json({received:true});
        const session=event.data.object,product=PRODUCTS[session.metadata?.product_key];
        if(!product||session.metadata?.site!=='katiemoore'||!REFERENCE.test(session.client_reference_id||''))return json({received:true});
        if(session.currency!=='usd'||session.amount_total!==product.amount)return json({received:true});
        const paid=session.payment_status==='paid';
        if(!paid&&event.type!=='checkout.session.async_payment_failed')return json({received:true});
        if(paid&&session.metadata?.brief_version==='2'){
          if(!env.WALLPAPER_ORDERS)return json({error:'Order storage unavailable'},503);
          const stub=env.WALLPAPER_ORDERS.get(env.WALLPAPER_ORDERS.idFromName(mode+':'+session.client_reference_id));
          const saved=await stub.fetch('https://order/paid',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(session)});
          if(!saved.ok)return json({error:'Order delivery unavailable'},503);
        }
        const key=mode+':order:'+session.client_reference_id;
        const previous=await env.ORDER_EVENTS.get(key,'json');
        if(previous?.paymentStatus==='paid'&&!paid)return json({received:true});
        await env.ORDER_EVENTS.put(key,JSON.stringify({reference:session.client_reference_id,sessionId:session.id,product:session.metadata.product_key,paymentStatus:paid?'paid':'failed',amount:session.amount_total,currency:session.currency,eventId:event.id,eventCreated:event.created}),{expirationTtl:7776000});
        return json({received:true});
      }
      return json({error:'Not found'},404,cors);
    }catch{
      // No customer data, request payloads, keys, or Stripe responses are logged.
      return json({error:'Checkout is temporarily unavailable. Please try again.'},503,isWebhook?{}:cors);
    }
  };
}
