(()=>{
 // Sandbox checkout, email delivery and all five PDF files verified before launch.
 const LIVE_ENABLED=true;
 const API='https://katie-moore-digital-downloads.katherine-rs-moore.workers.dev';
 const TEST_LINKS={"story_bank":"https://buy.stripe.com/test_4gM5kx7Bo6bMftX48Q08g02","practice_feedback":"https://buy.stripe.com/test_5kQ6oB9Jw9nYbdHgVC08g03","interview_preparation":"https://buy.stripe.com/test_00weV78Fsbw6dlPgVC08g04","complete_bundle":"https://buy.stripe.com/test_14AbIVaNAbw6epT8p608g05","chapter_workbook":"https://buy.stripe.com/test_7sYdR36xkas26XreNu08g06","career_workbook":"https://buy.stripe.com/test_eVqdR3cVIcAa2HbfRy08g07","chapter_story_bank":"https://buy.stripe.com/test_8x2fZbcVI6bM5Tn6gY08g08","chapter_practice_feedback":"https://buy.stripe.com/test_5kQ7sF8FscAa2Hbaxe08g09","chapter_interview_preparation":"https://buy.stripe.com/test_bJe9ANdZM2ZAftX48Q08g0a","chapter_complete_bundle":"https://buy.stripe.com/test_fZu4gtf3QdEe0z320I08g0b"};
 const LIVE_LINKS={"story_bank":"https://buy.stripe.com/14A14g6DMar84dP8333Je02","practice_feedback":"https://buy.stripe.com/fZudR23rA0Qy8u53MN3Je03","interview_preparation":"https://buy.stripe.com/4gM6oA3rAgPw5hT0AB3Je04","complete_bundle":"https://buy.stripe.com/eVqbIU2nw1UCdOp8333Je05","chapter_workbook":"https://buy.stripe.com/eVq8wIe6edDkfWx0AB3Je06","career_workbook":"https://buy.stripe.com/9B69AM7HQczg25H6YZ3Je07","chapter_story_bank":"https://buy.stripe.com/28EdR2bY62YG5hT1EF3Je08","chapter_practice_feedback":"https://buy.stripe.com/8x214g1js56O39L8333Je09","chapter_interview_preparation":"https://buy.stripe.com/4gM3co5zIdDk6lX0AB3Je0a","chapter_complete_bundle":"https://buy.stripe.com/28EdR20fofLs39L9773Je0b"};
 const test=new URLSearchParams(location.search).get('checkout')==='test';
 if(test){const notice=document.createElement('p');notice.className='template-test-notice';notice.textContent='Sandbox preview — test payments only. No real charge.';document.querySelector('.template-grid')?.prepend(notice);}
 document.querySelectorAll('.template-buy').forEach(button=>{
  const key=button.dataset.product;
  const free=['find_examples','chapter_brand'].includes(key);
  const href=free?(API?API+'/free?mode='+(test?'test':'live')+'&key='+encodeURIComponent(key):null):(test?TEST_LINKS[key]:LIVE_ENABLED?LIVE_LINKS[key]:null);
  if(!href)return;
  const link=document.createElement('a');link.className=button.className;link.dataset.product=key;link.href=href;link.textContent=free?'Download free →':key.endsWith('workbook')?'Get the workbook PDF →':'Get the template →';button.replaceWith(link);
 });
})();

