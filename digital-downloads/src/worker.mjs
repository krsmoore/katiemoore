import Stripe from 'stripe';
import {inquiryFetch,EventInquiryProcessor} from './inquiry.mjs';
import {createHandler,OrderProcessor} from './core.mjs';
function stripe(env,mode){return new Stripe(mode==='test'?env.STRIPE_TEST_SECRET_KEY:env.STRIPE_SECRET_KEY,{httpClient:Stripe.createFetchHttpClient()});}
const downloads=createHandler(stripe);
export default {async fetch(request,env){try{return await inquiryFetch(request,env)||await downloads(request,env);}catch{return Response.json({error:'Your inquiry could not be processed. Please try again.'},{status:500,headers:{'Cache-Control':'no-store','Access-Control-Allow-Origin':env.SITE_ORIGIN}});}}};
export class EventInquiry extends EventInquiryProcessor{}
export class DownloadOrder extends OrderProcessor{}
