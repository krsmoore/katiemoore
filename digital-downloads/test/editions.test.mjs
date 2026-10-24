import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG} from '../src/catalog.mjs';
import {createHandler,purchased} from '../src/core.mjs';
test('all paid edition products validate only their own fixed price and file',async()=>{
 for(const [key,p] of Object.entries(CATALOG).filter(([,p])=>p.amount)){
  const session={id:'cs_test_editions',livemode:false,mode:'payment',status:'complete',payment_status:'paid',payment_link:p.testLink,metadata:{site:'katiemoore',fulfillment:'digital-v1',product_key:key},currency:'usd',amount_subtotal:p.amount,amount_total:p.amount};
  const stripe={checkout:{sessions:{retrieve:async()=>session,listLineItems:async()=>({has_more:false,data:[{quantity:1,price:{id:p.testPrice,currency:'usd',unit_amount:p.amount}}]})}}};
  assert(p.testPrice&&p.testLink,key+' test checkout missing');
  assert.equal((await purchased(stripe,session.id,'test')).product.file,p.file);
  session.payment_link=CATALOG.story_bank.testLink===p.testLink?CATALOG.complete_bundle.testLink:CATALOG.story_bank.testLink;
  assert.equal(await purchased(stripe,session.id,'test'),null);
 }
});
test('free route allows both free editions but rejects paid and unknown products',async()=>{
 const files=[],handler=createHandler(()=>null),env={PDFS:{get:async key=>{files.push(key);return {body:'%PDF-test'};}}};
 for(const key of ['find_examples','chapter_brand'])assert.equal((await handler(new Request('https://api.example/free?mode=test&key='+key),env)).status,200);
 assert.deepEqual(files,[CATALOG.find_examples.file,CATALOG.chapter_brand.file]);
 for(const key of ['story_bank','chapter_workbook','chapter_complete_bundle','unknown'])assert.equal((await handler(new Request('https://api.example/free?mode=test&key='+key),env)).status,404);
});
