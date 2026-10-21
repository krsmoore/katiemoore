import Stripe from 'stripe';
import {createHandler,OrderProcessor} from './core.mjs';
function stripe(env,mode){return new Stripe(mode==='test'?env.STRIPE_TEST_SECRET_KEY:env.STRIPE_SECRET_KEY,{httpClient:Stripe.createFetchHttpClient()});}
export default {fetch:createHandler(stripe)};
export class DownloadOrder extends OrderProcessor{}
