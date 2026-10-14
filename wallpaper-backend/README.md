# Wallpaper embedded checkout backend

Cloudflare Worker supporting the two existing GitHub Pages questionnaires. Stripe checkout stays on the questionnaire page. Secret keys only belong in Worker secrets.

Routes:
- GET /config: public Stripe publishable key.
- POST /checkout-session: creates an embedded checkout session from a fixed, server-side product-to-price map.
- GET /session-status: verifies payment status without returning customer information.
- POST /webhook: verifies Stripe signatures and records paid/failed order references in ORDER_EVENTS KV.

Append ?mode=test for sandbox routes. Sandbox must be explicitly enabled in configuration. Questionnaire answers and images continue to email through the activated FormSubmit receiver; the order reference ties them to the Stripe session. No secrets or customer answers are logged.

Deployment needs a Cloudflare account, an ORDER_EVENTS KV namespace, and the following secret/config names:
- STRIPE_SECRET_KEY: restricted live key with Checkout Sessions write/read and related Products/Prices read access.
- STRIPE_PUBLISHABLE_KEY: live publishable key.
- STRIPE_WEBHOOK_SECRET: endpoint signing secret.
- STRIPE_TEST_SECRET_KEY, STRIPE_TEST_PUBLISHABLE_KEY, STRIPE_TEST_WEBHOOK_SECRET: sandbox counterparts.

Create Stripe webhook endpoints for /webhook and /webhook?mode=test with checkout.session.completed, checkout.session.async_payment_succeeded, and checkout.session.async_payment_failed events.

The frontend API base must be set to the deployed Worker URL only after both sandbox session creation and signed webhook delivery pass. The current public redirect checkout stays in place until then.

Use node --test test/*.test.mjs for the security and payment-state tests.