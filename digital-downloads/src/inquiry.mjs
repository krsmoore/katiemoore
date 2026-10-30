import {mailTransport} from './mail.mjs';
import {mac,token,readToken} from './security.mjs';
const inbox='katherine.rs.moore@gmail.com',MAX=10*1024*1024;
const fields=['interest','topic','audience','audience_size','goal','timing','date_start','date_end','preferred_time','time_zone','format','city','state','venue','duration','budget','name','email','organization','notes','event_link','originating_offering_id','source_path'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reply=(x,s=200,h={})=>Response.json(x,{status:s,headers:{'Cache-Control':'no-store',...h}});
export async function validateInquiry(form){
 const data={},errors={};
 if(form.get('website_check'))throw Error('Invalid inquiry');
 for(const key of fields){data[key]=String(form.get(key)||'').trim();if(data[key].length>4000)errors[key]='Please use 4,000 characters or fewer.';}
 for(const key of ['interest','audience','goal','timing','format','name','email'])if(!data[key])errors[key]='Please complete this field.';
 for(const [key,allowed] of Object.entries({interest:['Workshop','Keynote','Help me choose'],timing:['specific','range','flexible','unsure'],format:['In person','Virtual','Hybrid','Not decided yet']}))if(!allowed.includes(data[key]))errors[key]='Please choose an option.';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||data.email.length>254)errors.email='Enter a valid email address.';
 const dated=['specific','range'].includes(data.timing);
 const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 if(dated&&!validDate(data.date_start))errors.date_start='Choose a valid event date.';
 if(data.timing==='range'&&(!validDate(data.date_end)||data.date_end<data.date_start))errors.date_end='Choose an end date on or after the start date.';
 if(!dated)for(const k of ['date_start','date_end','preferred_time','time_zone'])delete data[k];
 if(data.timing!=='range')delete data.date_end;
 if(!['In person','Hybrid'].includes(data.format))for(const k of ['city','state','venue'])delete data[k];
 if(data.event_link){try{const u=new URL(/^[a-z][a-z\d+.-]*:/i.test(data.event_link)?data.event_link:'https://'+data.event_link);if(!['http:','https:'].includes(u.protocol)||!u.hostname.includes('.')||u.username||u.password)throw Error();data.event_link=u.href;}catch{errors.event_link='Enter a valid website link.';}}
 if(JSON.stringify(data).length>18000)errors.notes='Please shorten your inquiry.';
 const files=form.getAll('attachments').filter(f=>typeof f!=='string'&&f.size);
 if(files.length>3||files.reduce((n,f)=>n+f.size,0)>MAX)errors.attachments='Choose up to 3 files, totaling no more than 10 MB.';
 const uploads=[];
 if(!errors.attachments)for(const f of files){const name=f.name.replace(/[^\p{L}\p{N} ._()-]/gu,'_').slice(-150),bytes=new Uint8Array(await f.arrayBuffer()),ext=name.split('.').pop().toLowerCase();const pdf=ext==='pdf'&&new TextDecoder().decode(bytes.slice(0,5))==='%PDF-',doc=ext==='doc'&&[208,207,17,224,161,177,26,225].every((x,i)=>bytes[i]===x),docx=ext==='docx'&&bytes[0]===80&&bytes[1]===75&&bytes[2]===3&&bytes[3]===4;if(!pdf&&!doc&&!docx)errors.attachments='Upload PDF, DOC, or DOCX documents only.';else uploads.push({name,bytes,type:'application/octet-stream'});}
 return {data,uploads,errors};
}
export async function inquiryFetch(request,env){
 const url=new URL(request.url);if(!url.pathname.startsWith('/inquiry'))return null;
 const cors={'Access-Control-Allow-Origin':env.SITE_ORIGIN,'Vary':'Origin'};
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors,'Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
 if(url.pathname==='/inquiry'&&request.method==='POST'){
  if(request.headers.get('Origin')!==env.SITE_ORIGIN)return reply({error:'Origin not allowed'},403,cors);
  if(Number(request.headers.get('Content-Length'))>MAX+100000)return reply({error:'Files exceed the 10 MB total limit.'},413,cors);
  const raw=await request.arrayBuffer();if(raw.byteLength>MAX+100000)return reply({error:'Files exceed the 10 MB total limit.'},413,cors);
  const form=await new Response(raw,{headers:{'Content-Type':request.headers.get('Content-Type')}}).formData();
  const id=String(form.get('inquiry_id')||'');if(!/^[a-f\d-]{36}$/.test(id))return reply({error:'Invalid inquiry reference.'},400,cors);
  const ip=await mac(env.DOWNLOAD_SIGNING_SECRET,request.headers.get('CF-Connecting-IP')||'unknown');
  for(const [key,limit] of [['rate-'+ip+'-'+Math.floor(Date.now()/3600000),10],['rate-global-'+Math.floor(Date.now()/86400000),75]]){const r=await env.INQUIRIES.get(env.INQUIRIES.idFromName(key)).fetch('https://internal/rate?limit='+limit,{method:'POST'});if(r.status===429)return reply({error:'Too many inquiries. Please try again later.'},429,cors);}
  const result=await env.INQUIRIES.get(env.INQUIRIES.idFromName(id)).fetch('https://internal/save?id='+id,{method:'POST',headers:{'Content-Type':request.headers.get('Content-Type'),'X-API-Origin':url.origin},body:raw});return new Response(result.body,{status:result.status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
 }
 if(request.method==='GET'&&['/inquiry/view','/inquiry/file'].includes(url.pathname)){
  const claim=await readToken(env.DOWNLOAD_SIGNING_SECRET,url.searchParams.get('token'));if(!claim||claim.purpose!=='event-inquiry'||!/^[a-f\d-]{36}$/.test(claim.id))return new Response('This private inquiry link is invalid or has expired.',{status:403,headers:{'Cache-Control':'no-store'}});
  const object=await env.PDFS.get('event-inquiries/'+claim.id+'/details.json');if(!object)return new Response('Inquiry no longer available.',{status:404});const record=await object.json();
  const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
  if(url.pathname==='/inquiry/file'){const i=Number(url.searchParams.get('index'));if(!Number.isInteger(i)||!record.files[i])return new Response('File not found',{status:404});const f=record.files[i],asset=await env.PDFS.get(f.key);if(!asset)return new Response('File not found',{status:404});return new Response(asset.body,{headers:{...headers,'Content-Type':'application/octet-stream','Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(f.name)}});}
  const rows=Object.entries(record.data).filter(([,v])=>v).map(([k,v])=>'<dt>'+esc(k.replaceAll('_',' '))+'</dt><dd>'+esc(v)+'</dd>').join('');const links=record.files.map((f,i)=>'<li><a href="/inquiry/file?token='+encodeURIComponent(url.searchParams.get('token'))+'&amp;index='+i+'">'+esc(f.name)+'</a></li>').join('');
  return new Response('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Private event inquiry | Katie Moore</title><style>body{background:#f6f2ea;color:#18181b;font:16px/1.6 Arial;max-width:760px;margin:30px auto;padding:20px}h1,a{color:#702f3a}dt{font-weight:bold;text-transform:capitalize;margin-top:16px}dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}</style><h1>Event inquiry</h1><p>Reference '+esc(claim.id)+'</p><dl>'+rows+'</dl><h2>Attachments</h2><ul>'+links+'</ul><p>Private links expire after seven days. Stored inquiries are removed after 30 days.</p>',{headers:{...headers,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"}});
 }
 return reply({error:'Not found'},404,cors);
}
export class EventInquiryProcessor{
 constructor(ctx,env,send=fetch){this.ctx=ctx;this.env=env;this.send=mailTransport(env,send);}
 fetch(request){return this.ctx.blockConcurrencyWhile(async()=>{
  const u=new URL(request.url);
  if(u.pathname==='/rate'){const n=(await this.ctx.storage.get('count')||0)+1;await this.ctx.storage.put('count',n);await this.ctx.storage.setAlarm(Date.now()+2*86400000);return reply({},n>Number(u.searchParams.get('limit'))?429:200);}
  const form=await request.formData(),{data,uploads,errors}=await validateInquiry(form);if(Object.keys(errors).length)return reply({error:'Please check the highlighted fields.',fields:errors},422);
  const digest=await mac(this.env.DOWNLOAD_SIGNING_SECRET,JSON.stringify(data)+JSON.stringify(await Promise.all(uploads.map(async f=>({name:f.name,hash:await crypto.subtle.digest('SHA-256',f.bytes).then(b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join(''))})))));
  let record=await this.ctx.storage.get('inquiry');if(record&&record.digest!==digest)return reply({error:'This inquiry reference has already been used. Close and reopen the form for a new inquiry.'},409);
  if(!record||record.ready===false){const id=u.searchParams.get('id'),prefix='event-inquiries/'+id+'/';record={id,digest,data,files:uploads.map((f,i)=>({key:prefix+i,name:f.name})),created:record?.created||Date.now(),origin:request.headers.get('X-API-Origin'),attempts:0,ready:false};await this.ctx.storage.put('inquiry',record);await this.ctx.storage.setAlarm(record.created+30*86400000);for(let i=0;i<uploads.length;i++)await this.env.PDFS.put(record.files[i].key,uploads[i].bytes,{httpMetadata:{contentType:'application/octet-stream'}});await this.env.PDFS.put(prefix+'details.json',JSON.stringify(record));record.ready=true;await this.ctx.storage.put('inquiry',record);await this.ctx.storage.setAlarm(Date.now()+60000);}
  await this.deliver(record);return reply({accepted:true,reference:record.id},202);
 });}
 async deliver(r){if(r.sent||r.attention)return;try{const access=await token(this.env.DOWNLOAD_SIGNING_SECRET,{purpose:'event-inquiry',id:r.id,exp:Date.now()+7*86400000});const link=r.origin+'/inquiry/view?token='+encodeURIComponent(access);const subject='Event inquiry — '+r.data.interest+' — '+r.data.name.slice(0,100);const text='New event inquiry from '+r.data.name+' ('+r.data.email+').\nInterest: '+r.data.interest+'\nTopic: '+r.data.topic.slice(0,250)+'\nPrivate details and '+r.files.length+' attachment(s): '+link+'\nThe private link expires in seven days.';const html='<div style="background:#f6f2ea;padding:28px;font:16px/1.6 Arial;color:#18181b"><h1 style="color:#702f3a">Event inquiry</h1><p>From '+esc(r.data.name.slice(0,150))+' &lt;'+esc(r.data.email)+'&gt;</p><p>'+esc(r.data.interest)+' · '+esc(r.data.topic.slice(0,250))+'</p><p><a href="'+esc(link)+'">Read inquiry and download attachments</a></p><p>Reply to '+esc(r.data.email)+'. Private link expires in seven days.</p></div>';const result=await this.send('https://api.resend.com/emails',{method:'POST',headers:{'Idempotency-Key':'event-inquiry-'+r.id},body:JSON.stringify({to:[inbox],subject,text,html})});if(!result.ok)throw Error('Delivery failed');r.sent=true;}catch(e){r.attempts++;r.attention=!!e.needsReview;if(!r.attention&&r.attempts<12){await this.ctx.storage.setAlarm(Date.now()+Math.min(3600000,60000*2**r.attempts));}else r.attention=true;}await this.ctx.storage.put('inquiry',r);if(r.sent||r.attention)await this.ctx.storage.setAlarm(r.created+30*86400000);}
 async alarm(){const r=await this.ctx.storage.get('inquiry');if(!r){await this.ctx.storage.deleteAll();return;}if(Date.now()>=r.created+30*86400000){await this.env.PDFS.delete([...r.files.map(f=>f.key),'event-inquiries/'+r.id+'/details.json']);await this.ctx.storage.deleteAll();return;}if(r.ready===false){await this.ctx.storage.setAlarm(r.created+30*86400000);return;}await this.deliver(r);}
}
