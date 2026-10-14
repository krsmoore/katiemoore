const PRODUCTS = {
  vision_board_wallpaper: {amount:1500, live:'price_1UQI1p37dVOsPr0Aza6gPH0r', test:'price_1UKomi7V1kfjGKUWsIZhT4fj', page:'vision-board.html', prefix:'VB'},
  looking_forward_wallpaper: {amount:1000, live:'price_1UQI1q37dVOsPr0ATbRRu8FB', test:'price_1UQHcI7V1kfjGKUWPPmyZajv', page:'looking-forward.html', prefix:'LF'}
};
const REFERENCE=/^(VB|LF)-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
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
        return json({status:session.status,paymentStatus:session.payment_status,reference,amount:session.amount_total,currency:session.currency},200,cors);
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