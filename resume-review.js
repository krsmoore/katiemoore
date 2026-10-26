(() => {
  const form=document.getElementById('visionForm'),file=form.elements.attachment,zone=document.getElementById('uploadZone');
  const liveEnabled=false;
  if(!liveEnabled&&new URLSearchParams(location.search).get('checkout')!=='test'){
    const notice=document.createElement('p');notice.className='hint';notice.textContent='Preview: payment and delivery are being verified. Live submissions are not open yet.';form.before(notice);
    form.querySelector('button[type=submit]').disabled=true;
  }
  document.getElementById('orderRef').value='RR-'+crypto.randomUUID();
  const currentLocation=form.elements['Current city and state'],desired=form.elements['Desired city and state'];
  function validateLocation(){currentLocation.setCustomValidity(currentLocation.value.trim()||desired.value.trim()?'':'Please enter a current or desired location.');}
  currentLocation.addEventListener('input',validateLocation);desired.addEventListener('input',validateLocation);validateLocation();
  function validateFile(){const f=file.files[0];file.setCustomValidity(f&&(!/\.(pdf|doc|docx)$/i.test(f.name)||f.size>10000000)?'Please choose a PDF or Word document up to 10 MB.':'');document.getElementById('fileName').textContent=f?f.name:'';}
  file.addEventListener('change',validateFile);
  zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragging');});zone.addEventListener('dragleave',()=>zone.classList.remove('dragging'));
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('dragging');if(e.dataTransfer.files.length===1){file.files=e.dataTransfer.files;validateFile();}});
  form.addEventListener('submit',e=>{validateLocation();validateFile();if(!form.reportValidity())e.preventDefault();});
})();
