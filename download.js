(()=>{
 const API='https://katie-moore-digital-downloads.katherine-rs-moore.workers.dev';
 const params=new URLSearchParams(location.search),mode=params.get('mode')==='test'?'test':'live',sid=params.get('session_id'),token=params.get('token');
 const status=document.querySelector('#status'),link=document.querySelector('#download');
 // Remove bearer credentials from visible history after capturing them; no analytics on this page.
 history.replaceState(null,'',location.pathname);
 if(!API){status.textContent='Downloads are being connected. Please keep your payment email and contact me if you need help.';return;}
 if(token){link.href=API+'/file?mode='+mode+'&token='+encodeURIComponent(token);link.hidden=false;status.textContent='Use your private link below to download your PDF.';return;}
 if(!sid){status.textContent='Open this page from your checkout confirmation or the private link in your email.';return;}
 let attempts=0;
 async function verify(){try{const r=await fetch(API+'/verify?mode='+mode+'&session_id='+encodeURIComponent(sid),{cache:'no-store'});const data=await r.json();if(r.status===202){status.textContent='Your payment is still processing. Your PDF will be emailed once payment is confirmed.';if(++attempts<20)setTimeout(verify,3000);return;}if(!r.ok)throw Error();document.querySelector('#title').textContent=data.title;status.textContent='Your payment is confirmed. Download your '+data.pages+'-page PDF below. A private download link will also arrive by email.';link.href=data.downloadUrl;link.hidden=false;}catch{status.textContent='I couldn’t verify this download yet. Please try the link again or contact me with your payment email.';}}
 verify();
})();

