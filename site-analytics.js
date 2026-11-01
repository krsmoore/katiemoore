/* Private reporting. Replace the measurement ID only after the owner creates the property. */
(()=>{
 'use strict';
 const ID='G-QVWHQR826W',preference='km-analytics-consent-v1';
 if(!/^G-[A-Z0-9]+$/.test(ID)||navigator.globalPrivacyControl||navigator.doNotTrack==='1')return;
 let enabled=false,loaded=false;
 const slug=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
 const path=location.pathname,base='https://krsmoore.github.io';
 function send(name){if(enabled)window.gtag('event',name.slice(0,40),{page_location:base+path,page_referrer:referrer(),transport_type:'beacon'});}
 function referrer(){try{return new URL(document.referrer).origin}catch{return ''}}
 function start(){
  if(loaded)return;loaded=true;enabled=true;
  window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  window.gtag('config',ID,{send_page_view:!location.search.includes('embedded=1'),page_location:base+path,page_referrer:referrer(),allow_google_signals:false,allow_ad_personalization_signals:false});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.append(script);
 }
 document.addEventListener('click',event=>{
  const el=event.target.closest('a,button');if(!el)return;
  if(el.matches('[data-workshop]'))return send('workshop_'+slug(el.dataset.workshop));
  if(el.matches('[data-keynote]'))return send('keynote_'+slug(el.dataset.keynote));
  if(el.matches('[data-event-inquiry]'))return send('inquiry_'+slug(el.dataset.interest||'general'));
  if(el.matches('[data-product]'))return send('product_'+slug(el.dataset.product));
  if(el.matches('[data-story-id]'))return send('case_study_'+slug(el.dataset.storyId));
  if(el.id==='fitQuizButton')return send('career_explorer_open');
  if(el.matches('.category-nav [role=tab]'))return send('service_'+slug(el.id.replace('tab-','')));
  if(el.id==='next')return send('story_next_card');
  if(el.id==='prev')return send('story_previous_card');
  if(el.matches('.card-flip-toggle'))return send('story_flip_card');
  if(!el.href)return;
  let url;try{url=new URL(el.href)}catch{return}
  if(url.hostname==='cal.com'||url.hostname.endsWith('.cal.com'))return send('interview_booking_click');
  if(url.hostname==='buy.stripe.com')return send('checkout_click');
  if(url.hostname==='a.co'||url.hostname.endsWith('amazon.com')){
   const title=el.closest('article')?.querySelector('h3')?.textContent||'';
   const edition=/Building Your Career/i.test(title)?'building_career':'next_chapter';
   return send('book_'+edition+'_'+(/kindle/i.test(el.textContent)?'kindle':'paperback'));
  }
  if(url.protocol==='mailto:')return send('email_contact_click');
 },{capture:true});
 function choose(value){try{localStorage.setItem(preference,value)}catch{}document.getElementById('km-analytics-choice')?.remove();if(value==='yes')start();}
 let saved;try{saved=localStorage.getItem(preference)}catch{}
 window.addEventListener('storage',event=>{if(event.key===preference)location.reload();});
 if(window.top===window){const settings=document.createElement('button');settings.type='button';settings.textContent='Analytics preferences';settings.style.cssText='display:block;margin:12px auto;padding:10px 14px;background:#F6F2EA;color:#702F3A;border:1px solid #B3935A;font:12px Arial,sans-serif;cursor:pointer';settings.onclick=()=>{try{localStorage.removeItem(preference)}catch{}location.reload();};document.body.append(settings);}
 if(saved==='yes')start();
 if(saved)return;
 const note=document.createElement('aside');note.id='km-analytics-choice';note.setAttribute('aria-label','Optional website analytics');
 note.style.cssText='position:fixed;bottom:16px;left:16px;right:16px;max-width:540px;margin-left:auto;z-index:10000;background:#F6F2EA;color:#18181B;border:1px solid #B3935A;padding:18px;font:14px/1.5 Arial,sans-serif;box-shadow:0 6px 24px #18181b26';
 note.innerHTML='<p style="margin:0 0 12px">May I use optional analytics to understand which pages and resources are useful? This uses Google Analytics. Your form answers and uploaded files are never included. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">How Google uses this data</a></p><button type="button" data-choice="yes">Allow analytics</button> <button type="button" data-choice="no">No thanks</button>';
 note.querySelectorAll('button').forEach(button=>{button.style.cssText='min-height:44px;padding:10px 16px;border:1px solid #702F3A;background:#F6F2EA;color:#702F3A;font:14px Arial,sans-serif;cursor:pointer';button.addEventListener('click',()=>choose(button.dataset.choice))});
 if(window.top===window)document.body.append(note);
})();

