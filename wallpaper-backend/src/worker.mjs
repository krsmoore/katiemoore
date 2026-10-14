import Stripe from 'stripe';
import { createHandler } from './handler.mjs';
import {OrderProcessor} from './order.mjs';

function client(env, mode) {
  const key = mode === 'test' ? env.STRIPE_TEST_SECRET_KEY : env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Stripe key is not configured');
  return new Stripe(key, {httpClient: Stripe.createFetchHttpClient()});
}

export default {fetch: createHandler(client, Stripe.createSubtleCryptoProvider())};
export class WallpaperOrder extends OrderProcessor {
  constructor(ctx,env){super(ctx,env,client);}
}