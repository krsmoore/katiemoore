import {PRODUCTS} from './handler.mjs';
const REF=/^(VB|LF)-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_UPLOAD=10000000, CHUNK=512000, DAY=86400000;
const COMMON=['name','email','Feelings','Other feeling','Color palette','Custom colors','Additional preferences','Phone type','Phone model','Clock placement','Lock screen widgets','Common notifications','Notification display','Lock screen layout notes','Photo instructions','Photo permission'];
const FIELDS={vision_board_wallpaper:[...COMMON,'Goal 1','Goal 2','Goal 3','Life areas','Other life area','Milestone','Visual style','Included text'],looking_forward_wallpaper:[...COMMON,'Looking forward 1','Looking forward 2','Looking forward 3','Looking forward 4','Looking forward 5','Date for item 1','Date for item 2','Date for item 3','Date for item 4','Date for item 5','People and pets','Little things','Visual styles']};
function fail(message,status=400){throw Object.assign(new Error(message),{status});}
const reply=(x,status=200)=>Response.json(x,{status,headers:{'Cache-Control':'no-store'}});
const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
export async function parseBrief(request){
  if(Number(request.headers.get('Content-Length')||0)>MAX_UPLOAD+100000)fail('Please keep photos under 10 MB combined.',413);
  const raw=await request.arrayBuffer();if(raw.byteLength>MAX_UPLOAD+100000)fail('Please keep photos under 10 MB combined.',413);
  const form=await new Request(request.url,{method:'POST',headers:{'Content-Type':request.headers.get('Content-Type')||''},body:raw}).formData();
  const product=form.get('product'),reference=form.get('reference'),p=PRODUCTS[product];
  if(!p||typeof reference!=='string'||!REF.test(reference)||!reference.startsWith(p.prefix+'-'))fail('Invalid questionnaire. Please refresh and try again.');
  if(form.get('_honey'))fail('Invalid submission.');
  const fields={};let textSize=0;
  for(const key of FIELDS[product]){
    const values=form.getAll(key).filter(x=>typeof x==='string').map(x=>x.trim()).filter(Boolean);
    if(values.length>15||values.some(x=>x.length>1000))fail('An answer is too long.');
    if(values.length){fields[key]=[...new Set(values)];textSize+=values.join('').length;}
  }
  if(textSize>20000)fail('The questionnaire is too long.');
  const value=key=>fields[key]?.[0];
  if(!value('name')||value('name').length>100||!value('email')||value('email').length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email')))fail('Please enter your name and email.');
  for(const key of ['Phone type','Clock placement','Lock screen widgets','Notification display','Color palette'])if(!value(key))fail('Please complete your phone layout and color choices.');
  const feelings=fields.Feelings?.length||0;
  if(product==='vision_board_wallpaper'){
    if(['Goal 1','Goal 2','Goal 3','Milestone','Visual style'].some(k=>!value(k))||feelings!==3||!fields['Life areas']?.length||fields['Life areas'].length>4)fail('Please complete your goals, feelings, and style choices.');
  }else if(!value('Looking forward 1')||feelings<1||feelings>3||!fields['Visual styles']?.length||fields['Visual styles'].length>2)fail('Please complete your first item, feelings, and style choices.');
  const photos=[];let total=0;
  for(const name of ['attachment','attachment2','attachment3']){
    const file=form.get(name);if(!file||typeof file==='string'||!file.size)continue;
    total+=file.size;if(total>MAX_UPLOAD)fail('Please keep photos under 10 MB combined.',413);
    const bytes=new Uint8Array(await file.arrayBuffer());
    const png=file.type==='image/png'&&bytes.length>=8&&[137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b);
    const jpeg=file.type==='image/jpeg'&&bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
    if(!png&&!jpeg)fail('Please upload valid JPEG or PNG photos.');
    photos.push({name:'photo-'+(photos.length+1)+(png?'.png':'.jpg'),type:file.type,size:file.size,hash:await digest(bytes),bytes:bytes.buffer});
  }
  if(photos.length&&!value('Photo permission'))fail('Please confirm you have permission to use these photos.');
  const hash=await digest(new TextEncoder().encode(JSON.stringify({product,reference,fields,photos:photos.map(({bytes,...p})=>p)})));
  return {product,reference,fields,photos,hash};
}
export class OrderProcessor{
  constructor(ctx,env,getStripe,send=fetch){this.ctx=ctx;this.env=env;this.getStripe=getStripe;this.send=send;}
  fetch(request){return this.ctx.blockConcurrencyWhile(()=>this.handle(request));}
  async handle(request){
    try{
      const url=new URL(request.url);
      if(url.pathname==='/stage'){
        const mode=url.searchParams.get('mode')==='test'?'test':'live';
        const brief=await parseBrief(request);let record=await this.ctx.storage.get('record');
        if(record&&record.hash!==brief.hash)return reply({error:'This checkout already has a saved questionnaire. Start a new questionnaire to change it.'},409);
        if(!record){
          record={product:brief.product,reference:brief.reference,fields:brief.fields,hash:brief.hash,mode,created:Date.now(),paymentStatus:'unpaid',deliveryStatus:'pending',photos:brief.photos.map(({bytes,...p})=>p)};
          await this.ctx.storage.transaction(async s=>{for(let i=0;i<brief.photos.length;i++){const bytes=brief.photos[i].bytes;for(let start=0,n=0;start<bytes.byteLength;start+=CHUNK,n++)await s.put('photo:'+i+':'+n,bytes.slice(start,start+CHUNK));}await s.put('record',record);await s.setAlarm(record.created+30*DAY);});
        }
        const stripe=this.getStripe(this.env,mode),p=PRODUCTS[record.product];
        let session=record.sessionId?await stripe.checkout.sessions.retrieve(record.sessionId):null;
        if(!session){session=await stripe.checkout.sessions.create({mode:'payment',ui_mode:'embedded_page',redirect_on_completion:'if_required',line_items:[{price:p[mode],quantity:1}],customer_email:record.fields.email[0],client_reference_id:record.reference,metadata:{site:'katiemoore',product_key:record.product,order_reference:record.reference,brief_version:'2'},return_url:this.env.SITE_BASE+'/'+p.page+'?pay='+record.reference+(mode==='test'?'&checkout=test':'')+'&session_id={CHECKOUT_SESSION_ID}'},{idempotencyKey:mode+':wallpaper-v2:'+record.reference});record.sessionId=session.id;await this.ctx.storage.put('record',record);}
        return reply({clientSecret:session.client_secret,sessionId:session.id,reference:record.reference});
      }
      if(url.pathname==='/paid'){
        const session=await request.json(),record=await this.ctx.storage.get('record');
        if(!record||record.sessionId!==session.id||record.reference!==session.client_reference_id||record.product!==session.metadata?.product_key||session.payment_status!=='paid'||session.amount_total!==PRODUCTS[record.product].amount||session.currency!=='usd')return reply({received:true});
        if(record.paymentStatus!=='paid'){record.paymentStatus='paid';record.paidAt=Date.now();await this.ctx.storage.put('record',record);}
        await this.deliver(record);return reply({received:true});
      }
      if(url.pathname==='/status'){
        const record=await this.ctx.storage.get('record');
        if(!record||record.sessionId!==url.searchParams.get('session_id'))return reply({error:'Order not found'},404);
        return reply({deliveryStatus:record.deliveryStatus});
      }
      return reply({error:'Not found'},404);
    }catch(err){return reply({error:err.status?err.message:'Checkout is temporarily unavailable. Your saved questionnaire is safe; please retry.'},err.status||503);}
  }
  async deliver(record){
    if(record.paymentStatus!=='paid'||record.deliveryStatus==='sent')return;
    const body=new FormData();
    for(const [key,values] of Object.entries(record.fields||{}))body.set(key,values.join(', '));
    body.set('Order reference',record.reference);body.set('Payment status',record.mode==='test'?'SANDBOX TEST — no real payment':'PAID — verified by Stripe');body.set('Stripe Checkout Session',record.sessionId);
    body.set('_subject',(record.mode==='test'?'SANDBOX TEST — ':'')+(record.product==='vision_board_wallpaper'?'Vision Board Wallpaper':'Looking Forward Wallpaper')+' — PAID — '+record.reference);
    body.set('_template','table');body.set('_captcha','false');
    for(let i=0;i<(record.photos||[]).length;i++){
      const photo=record.photos[i],parts=[];for(let n=0;n<Math.ceil(photo.size/CHUNK);n++)parts.push(await this.ctx.storage.get('photo:'+i+':'+n));
      body.set(i===0?'attachment':'attachment'+(i+1),new Blob(parts,{type:photo.type}),photo.name);
    }
    try{
      const response=await this.send('https://formsubmit.co/'+this.env.BRIEF_INBOX,{method:'POST',headers:{Referer:this.env.SITE_BASE+'/'+PRODUCTS[record.product].page},body,signal:AbortSignal.timeout(15000)});
      const text=await response.text();let success=false;try{const result=JSON.parse(text);success=result.success===true||result.success==='true';}catch{success=/The form was submitted successfully/i.test(text);}
      if(!response.ok||!success)throw Error('Email was not accepted');
      record.deliveryStatus='sent';record.sentAt=Date.now();await this.ctx.storage.put('record',record);
      // Remove the saved answers and images after the email service accepts delivery.
      const keys=[...(await this.ctx.storage.list({prefix:'photo:'})).keys()];if(keys.length)await this.ctx.storage.delete(keys);
      delete record.fields;record.photos=[];await this.ctx.storage.put('record',record);await this.ctx.storage.setAlarm(Date.now()+90*DAY);
    }catch{record.deliveryStatus='retrying';record.deliveryAttempts=(record.deliveryAttempts||0)+1;await this.ctx.storage.put('record',record);await this.ctx.storage.setAlarm(Date.now()+Math.min(3600000,60000*2**Math.min(record.deliveryAttempts,6)));}
  }
  async alarm(){return this.ctx.blockConcurrencyWhile(async()=>{const r=await this.ctx.storage.get('record');if(!r)return;if(r.paymentStatus==='paid'&&r.deliveryStatus!=='sent'){await this.deliver(r);return;}await this.ctx.storage.deleteAll();});}
}