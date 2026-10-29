(() => {
 const form=document.getElementById('workshopInquiry');
 const select=document.getElementById('workshop');
 const requested=new URLSearchParams(location.search).get('workshop');
 if([...select.options].some(option=>option.value===requested))select.value=requested;
 function updateSubject(){form.elements._subject.value='Workshop inquiry — '+select.options[select.selectedIndex].text;}
 select.addEventListener('change',updateSubject);updateSubject();
})();
