(() => {
  const apiBase=String(window.WALLPAPER_API_BASE||'').replace(/\/$/,'');
  if(!apiBase)return; // Enable only after the deployed backend has passed sandbox tests.
  const product=location.pathname.endsWith('looking-forward.html')?'looking_forward_wallpaper':'vision_board_wallpaper';
  const form=document.getElementById('visionForm'),params=new URLSearchParams(location.search);
  const mode=params.get('checkout')==='test'?'test':'live';
  const modeQuery='?mode='+mode;
  const section=document.createElement('section');section.className='embedded-payment';section.hidden=true;
  const heading=document.createElement('h2');heading.textContent='Your wallpaper. Your next step.';
  const note=document.createElement('p');note.textContent='Your design brief has been submitted. Complete payment securely below.';
  const status=document.createElement('p');status.setAttribute('role','status');
  const mount=document.createElement('div');mount.id='embeddedCheckout';
  const retry=document.createElement('button');retry.type='button';retry.textContent='Retry checkout';retry.hidden=true;
  const back=document.createElement('a');back.href=location.pathname+(mode==='test'?'?checkout=test':'');back.textContent='Start a new questionnaire';
  section.append(heading,note,status,mount,retry,back);form.after(section);
  const error=document.getElementById('formError');
  const storageKey=reference=>'wallpaper-payment:'+reference;
  form.addEventListener('submit',event=>{
    if(event.defaultPrevented||!form.checkValidity())return;
    const reference=document.getElementById('orderRef').value;
    try{sessionStorage.setItem(storageKey(reference),JSON.stringify({reference,email:form.elements.email.value,product,mode}));}
    catch{event.preventDefault();error.textContent='This browser could not keep your checkout details. Please enable browser storage or try another browser.';error.hidden=false;return;}
    const next=new URL(location.pathname,location.origin);next.searchParams.set('pay',reference);if(mode==='test')next.searchParams.set('checkout','test');
    document.getElementById('checkoutNext').value=next.href;
  });
  const reference=params.get('pay');if(!reference)return;
  form.hidden=true;section.hidden=false;
  let data;try{data=JSON.parse(sessionStorage.getItem(storageKey(reference))||'null');}catch{}
  if(!data||data.reference!==reference||data.product!==product||data.mode!==mode){status.textContent='Please return to the browser where you completed your questionnaire, or start a new questionnaire.';note.hidden=true;return;}
  let checkout,sessionId=params.get('session_id')||data.sessionId;
  async function api(path,options={}){const response=await fetch(apiBase+path,{...options,credentials:'omit'});const result=await response.json();if(!response.ok)throw Error(result.error||'Checkout unavailable');return result;}
  async function showStatus(){
    if(!sessionId)return;
    const result=await api('/session-status'+modeQuery+'&session_id='+encodeURIComponent(sessionId)+'&reference='+encodeURIComponent(reference));
    if(result.status==='complete'&&result.paymentStatus==='paid'){
      checkout?.destroy();mount.replaceChildren();note.textContent='Payment received. Katie has your brief and will create your personalized wallpaper.';
      status.textContent='Order reference: '+reference;retry.hidden=true;sessionStorage.setItem(storageKey(reference),JSON.stringify({reference,product,mode,sessionId}));return true;
    }
    if(result.status==='complete'){status.textContent='Your payment is still processing. Your order will be ready once Stripe confirms payment.';retry.hidden=false;return true;}
    return false;
  }
  async function begin(){
    retry.hidden=true;status.textContent='Loading secure checkout…';
    try{
      if(sessionId&&await showStatus())return;
      const config=await api('/config'+modeQuery);
      if(typeof window.Stripe!=='function'){
        await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://js.stripe.com/v3/';script.onload=resolve;script.onerror=()=>reject(Error('Unable to load Stripe'));document.head.append(script);});
      }
      checkout?.destroy();
      const stripe=window.Stripe(config.publishableKey);
      checkout=await stripe.initEmbeddedCheckout({
        fetchClientSecret:async()=>{const result=await api('/checkout-session'+modeQuery,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});sessionId=result.sessionId;data.sessionId=sessionId;sessionStorage.setItem(storageKey(reference),JSON.stringify(data));return result.clientSecret;},
        onComplete:()=>showStatus().catch(()=>{status.textContent='We could not verify the payment yet. Retry to check the payment status.';retry.hidden=false;})
      });
      checkout.mount('#embeddedCheckout');status.textContent='';
    }catch{status.textContent='Secure checkout could not load. Your brief has been submitted. Please retry or contact Katie.';retry.hidden=false;}
  }
  retry.addEventListener('click',begin);begin();
})();