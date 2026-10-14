(() => {
  const apiBase=String(window.WALLPAPER_API_BASE||'').replace(/\/$/,'');if(!apiBase)return;
  const form=document.getElementById('visionForm'),params=new URLSearchParams(location.search),mode=params.get('checkout')==='test'?'test':'live';
  const product=location.pathname.endsWith('looking-forward.html')?'looking_forward_wallpaper':'vision_board_wallpaper';
  const prefix=product==='vision_board_wallpaper'?'VB':'LF',price=prefix==='VB'?'$15':'$10',query='?mode='+mode;
  const submitArea=form.querySelector('.submit-area'),prepareButton=form.querySelector('button[type="submit"]'),questions=form.querySelector('.questions');
  prepareButton.textContent='Continue to payment — '+price;
  const section=document.createElement('section');section.className='embedded-payment';section.hidden=true;
  const heading=document.createElement('h2');heading.textContent='Pay & submit';
  const note=document.createElement('p');note.textContent='Complete payment below to submit your questionnaire and photos. They will be sent to Katie automatically once payment is confirmed.';
  const status=document.createElement('p');status.setAttribute('role','status');
  const mount=document.createElement('div');mount.id='embeddedCheckout';
  const retry=document.createElement('button');retry.type='button';retry.textContent='Retry checkout';retry.hidden=true;
  const edit=document.createElement('button');edit.type='button';edit.textContent='Edit my answers';edit.hidden=true;
  const restart=document.createElement('a');restart.href=location.pathname+(mode==='test'?'?checkout=test':'');restart.textContent='Start a new questionnaire';restart.hidden=true;
  section.append(heading,note,status,mount,retry,edit,restart);submitArea.before(section);
  let checkout,sessionId=params.get('session_id'),reference=params.get('pay'),clientSecret,busy=false,hasAnswers=false;
  const fields=()=>form.querySelectorAll('fieldset');
  const error=document.getElementById('formError');
  async function api(path,options={}){const response=await fetch(apiBase+path,{...options,credentials:'omit'});const data=await response.json();if(!response.ok)throw Error(data.error||'Checkout unavailable');return data;}
  function remember(){const url=new URL(location.href);url.searchParams.set('pay',reference);url.searchParams.set('session_id',sessionId);history.replaceState(null,'',url);}
  async function receipt(){
    const result=await api('/session-status'+query+'&session_id='+encodeURIComponent(sessionId)+'&reference='+encodeURIComponent(reference));
    if(result.status==='complete'&&result.paymentStatus==='paid'){
      checkout?.destroy();mount.replaceChildren();questions.hidden=true;submitArea.hidden=true;edit.hidden=true;retry.hidden=true;restart.hidden=false;
      heading.textContent='Payment received. Questionnaire submitted.';
      note.textContent=result.deliveryStatus==='sent'?'Katie has your answers and photos and will create your personalized wallpaper.':'Your answers and photos are securely saved, and submission will finish automatically. You can close this page.';
      status.textContent='Order reference: '+reference;return true;
    }
    if(result.status==='complete'){note.textContent='Your payment is processing. Your questionnaire and photos will be sent automatically when Stripe confirms payment. You can close this page.';edit.hidden=true;retry.hidden=false;restart.hidden=false;status.textContent='Order reference: '+reference;return true;}
    if(result.status==='expired'){status.textContent='This checkout has expired. Please start a new questionnaire.';retry.hidden=true;edit.hidden=true;restart.hidden=false;return true;}
    return false;
  }
  async function begin(){
    retry.hidden=true;status.textContent='Loading secure checkout…';
    try{
      if(sessionId&&await receipt())return;
      if(!clientSecret){const result=await api('/resume'+query+'&session_id='+encodeURIComponent(sessionId)+'&reference='+encodeURIComponent(reference));clientSecret=result.clientSecret;}
      const config=await api('/config'+query);
      if(typeof window.Stripe!=='function')await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://js.stripe.com/v3/';script.onload=resolve;script.onerror=()=>reject(Error('Unable to load secure payment'));document.head.append(script);});
      checkout?.destroy();checkout=await window.Stripe(config.publishableKey).initEmbeddedCheckout({fetchClientSecret:async()=>clientSecret,onComplete:()=>receipt().catch(()=>{status.textContent='Payment status could not be checked yet. Your saved questionnaire is safe. Retry to check.';retry.hidden=false;})});
      checkout.mount('#embeddedCheckout');status.textContent='';edit.hidden=!hasAnswers;
    }catch{status.textContent='Secure checkout could not load. Your saved questionnaire is safe; please retry.';retry.hidden=false;restart.hidden=false;}
  }
  form.addEventListener('submit',async event=>{
    if(event.defaultPrevented)return;event.preventDefault();if(busy||!form.reportValidity())return;busy=true;prepareButton.disabled=true;error.hidden=true;
    const body=new FormData(form);reference=document.getElementById('orderRef').value;body.set('reference',reference);body.set('product',product);
    for(const key of ['_subject','_next','_template','Payment status','Order reference'])body.delete(key);
    prepareButton.textContent='Preparing secure checkout…';
    try{
      const saved=await api('/submit'+query,{method:'POST',body});clientSecret=saved.clientSecret;sessionId=saved.sessionId;reference=saved.reference;hasAnswers=true;remember();
      fields().forEach(f=>f.disabled=true);submitArea.hidden=true;section.hidden=false;section.scrollIntoView({block:'start',behavior:'smooth'});await begin();
    }catch(err){error.textContent=err.message;error.hidden=false;prepareButton.disabled=false;prepareButton.textContent='Continue to payment — '+price;}
    finally{busy=false;}
  });
  edit.addEventListener('click',async()=>{
    edit.disabled=true;
    try{const result=await api('/cancel'+query+'&session_id='+encodeURIComponent(sessionId)+'&reference='+encodeURIComponent(reference),{method:'POST'});if(result.status==='complete'){await receipt();return;}
      checkout?.destroy();mount.replaceChildren();section.hidden=true;submitArea.hidden=false;fields().forEach(f=>f.disabled=false);prepareButton.disabled=false;prepareButton.textContent='Continue to payment — '+price;
      document.getElementById('orderRef').value=prefix+'-'+crypto.randomUUID();reference=sessionId=clientSecret=null;
      const url=new URL(location.href);url.searchParams.delete('pay');url.searchParams.delete('session_id');history.replaceState(null,'',url);submitArea.scrollIntoView({block:'center',behavior:'smooth'});
    }catch{status.textContent='We could not close this checkout yet. Please retry before editing.';}
    finally{edit.disabled=false;}
  });
  retry.addEventListener('click',begin);
  if(reference&&sessionId){questions.hidden=true;submitArea.hidden=true;section.hidden=false;restart.hidden=false;begin();}
})();