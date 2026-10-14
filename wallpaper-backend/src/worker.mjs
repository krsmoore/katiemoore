import Stripe from 'stripe';
import { createHandler } from './handler.mjs';

function client(env, mode) {
  const key = mode === 'test' ? env.STRIPE_TEST_SECRET_KEY : env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Stripe key is not configured');
  return new Stripe(key, {httpClient: Stripe.createFetchHttpClient()});
}

export default {fetch: createHandler(client, Stripe.createSubtleCryptoProvider())};