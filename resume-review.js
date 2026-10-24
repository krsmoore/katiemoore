(() => {
  const form=document.getElementById('visionForm'),file=form.elements.attachment,zone=document.getElementById('uploadZone');
  document.getElementById('orderRef').value='RR-'+crypto.randomUUID();
  const location=form.elements['Current city and state'],desired=form.elements['Desired city and state'];
  function validateLocation(){location.setCustomValidity(location.value.trim()||desired.value.trim()?'':'Please enter a current or desired location.');}
  location.addEventListener('input',validateLocation);desired.addEventListener('input',validateLocation);validateLocation();
  function validateFile(){const f=file.files[0];file.setCustomValidity(f&&(!/\.(pdf|doc|docx)$/i.test(f.name)||f.size>10000000)?'Please choose a PDF or Word document up to 10 MB.':'');document.getElementById('fileName').textContent=f?f.name:'';}
  file.addEventListener('change',validateFile);
  zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragging');});zone.addEventListener('dragleave',()=>zone.classList.remove('dragging'));
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('dragging');if(e.dataTransfer.files.length===1){file.files=e.dataTransfer.files;validateFile();}});
  form.addEventListener('submit',e=>{validateLocation();validateFile();if(!form.reportValidity())e.preventDefault();});
})();
