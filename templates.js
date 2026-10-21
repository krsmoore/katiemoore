(()=>{
 // Live sales stay disabled until the complete sandbox delivery flow passes.
 const LIVE_ENABLED=false;
 const API='https://katie-moore-digital-downloads.katherine-rs-moore.workers.dev';
 const TEST_LINKS={"story_bank":"https://buy.stripe.com/test_4gM5kx7Bo6bMftX48Q08g02","practice_feedback":"https://buy.stripe.com/test_5kQ6oB9Jw9nYbdHgVC08g03","interview_preparation":"https://buy.stripe.com/test_00weV78Fsbw6dlPgVC08g04","complete_bundle":"https://buy.stripe.com/test_14AbIVaNAbw6epT8p608g05"};
 const LIVE_LINKS={};
 const test=new URLSearchParams(location.search).get('checkout')==='test';
 if(test){const notice=document.createElement('p');notice.className='template-test-notice';notice.textContent='Sandbox preview — test payments only. No real charge.';document.querySelector('.template-grid')?.prepend(notice);}
 document.querySelectorAll('.template-buy').forEach(button=>{
  const key=button.dataset.product;
  const href=key==='find_examples'?(API?API+'/free?mode=test':null):(test?TEST_LINKS[key]:LIVE_ENABLED?LIVE_LINKS[key]:null);
  if(!href)return;
  const link=document.createElement('a');link.className=button.className;link.dataset.product=key;link.href=href;link.textContent=key==='find_examples'?'Download free →':'Get the template →';button.replaceWith(link);
 });
})();

