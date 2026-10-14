const sandboxCheckout=new URLSearchParams(location.search).get('checkout')==='test';
const checkoutUrl=sandboxCheckout?"https://buy.stripe.com/test_eVq00dcVI1Vw4PjfRy08g00":"https://buy.stripe.com/3cI14g1js6aSeStcjj3Je00";
const form=document.getElementById('visionForm');
const reference='VB-'+crypto.randomUUID();
document.getElementById('orderRef').value=reference;
document.getElementById('emailSubject').value='Vision Board Wallpaper design brief — '+reference+(sandboxCheckout?' (SANDBOX)':'');
document.getElementById('checkoutNext').value=checkoutUrl+'?client_reference_id='+encodeURIComponent(reference);
document.querySelectorAll('[data-limit]').forEach(group=>{
 const update=()=>{
  const checked=[...group.querySelectorAll('input:checked')],max=Number(group.dataset.limit);
  group.querySelectorAll('input').forEach(input=>input.disabled=!input.checked&&checked.length>=max);
  group.nextElementSibling.textContent=checked.length+' of '+max+' selected';
  const other=group.parentElement.querySelector('.other-field'),active=checked.some(i=>i.value==='Other');
  other.hidden=!active;other.querySelector('input').required=active;
 };
 group.addEventListener('change',update);update();
});
document.querySelectorAll('[name="Color palette"]').forEach(input=>input.addEventListener('change',()=>{
 const custom=document.getElementById('customPalette'),active=input.value==='Custom (tell us)';
 custom.hidden=!active;custom.querySelector('input').required=active;
}));
document.querySelectorAll('[data-counter]').forEach(input=>input.addEventListener('input',()=>document.getElementById(input.dataset.counter).textContent=input.value.length+'/'+input.maxLength));
form.addEventListener('submit',event=>{
 const error=document.getElementById('formError');
 for(const group of document.querySelectorAll('[data-limit]')){
  const count=group.querySelectorAll('input:checked').length,min=Number(group.dataset.min);
  if(count<min){event.preventDefault();error.textContent=group.dataset.group==='Feelings'?'Choose three feelings before continuing.':'Choose at least one life area before continuing.';error.hidden=false;group.scrollIntoView({block:'center',behavior:'smooth'});return;}
 }
 for(const group of document.querySelectorAll("[data-limit]")){const hidden=document.createElement("input");hidden.type="hidden";hidden.name="Selected "+group.dataset.group;hidden.value=[...group.querySelectorAll("input:checked")].map(input=>input.value).join(", ");form.append(hidden);}
 error.hidden=true;
});

const photoInputs=[...document.querySelectorAll('[data-photo]')];const photoConsent=document.getElementById('photoConsent');
function validatePhotos(){const files=photoInputs.flatMap(input=>[...input.files]);const error=document.getElementById('photoError');document.getElementById('photoConsentRow').hidden=files.length===0;photoConsent.required=files.length>0;let message='';if(files.some(file=>!['image/jpeg','image/png'].includes(file.type)))message='Please choose JPEG or PNG photos.';else if(files.reduce((sum,file)=>sum+file.size,0)>10000000)message='Please keep the combined photo size under 10 MB.';error.textContent=message;error.hidden=!message;photoInputs[0].setCustomValidity(message);return !message;}
photoInputs.forEach(input=>input.addEventListener('change',validatePhotos));form.addEventListener('submit',event=>{if(!validatePhotos()){event.preventDefault();document.getElementById('photoError').scrollIntoView({block:'center'});}});

if(sandboxCheckout){const banner=document.querySelector('.test-banner');banner.hidden=false;banner.textContent='Sandbox checkout preview — no real payment is collected.';form.querySelector('[name="Payment status"]').value='Sandbox questionnaire — not a real paid order.';form.querySelector('button[type="submit"]').textContent='Send answers & continue to test checkout →';}
