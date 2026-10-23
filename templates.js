(()=>{
 // Sandbox checkout, email delivery and all five PDF files verified before launch.
 const LIVE_ENABLED=true;
 const API='https://katie-moore-digital-downloads.katherine-rs-moore.workers.dev';
 const TEST_LINKS={"story_bank":"https://buy.stripe.com/test_4gM5kx7Bo6bMftX48Q08g02","practice_feedback":"https://buy.stripe.com/test_5kQ6oB9Jw9nYbdHgVC08g03","interview_preparation":"https://buy.stripe.com/test_00weV78Fsbw6dlPgVC08g04","complete_bundle":"https://buy.stripe.com/test_14AbIVaNAbw6epT8p608g05"};
 const LIVE_LINKS={"story_bank":"https://buy.stripe.com/14A14g6DMar84dP8333Je02","practice_feedback":"https://buy.stripe.com/fZudR23rA0Qy8u53MN3Je03","interview_preparation":"https://buy.stripe.com/4gM6oA3rAgPw5hT0AB3Je04","complete_bundle":"https://buy.stripe.com/eVqbIU2nw1UCdOp8333Je05"};
 const test=new URLSearchParams(location.search).get('checkout')==='test';
 if(test){const notice=document.createElement('p');notice.className='template-test-notice';notice.textContent='Sandbox preview — test payments only. No real charge.';document.querySelector('.template-grid')?.prepend(notice);}
 document.querySelectorAll('.template-buy').forEach(button=>{
  const key=button.dataset.product;
  const href=key==='find_examples'?(API?API+'/free?mode='+(test?'test':'live'):null):(test?TEST_LINKS[key]:LIVE_ENABLED?LIVE_LINKS[key]:null);
  if(!href)return;
  const link=document.createElement('a');link.className=button.className;link.dataset.product=key;link.href=href;link.textContent=key==='find_examples'?'Download free →':'Get the template →';button.replaceWith(link);
 });
})();

