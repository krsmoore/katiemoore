# Private printable delivery

Cloudflare Worker for Katie Moore's printable products. The PDF originals live only in the private `katie-moore-private-templates` R2 bucket; never commit them here. The existing wallpaper Worker is separate.

Live paid sales are enabled after sandbox checkout, verified webhook, actual Gmail delivery, and exact PDF checks passed for all four paid products. The free PDF was also verified against its original. Delivery with checkout closed and duplicate events was checked; delayed payment, signature and token protections passed automated tests.

## Deployment

Set this directory as the Cloudflare Workers Builds root. Install with `npm install`, deploy with `npx wrangler deploy`. `wrangler.jsonc` defines the private R2 binding and SQLite Durable Object migration. No build command is required.

Add encrypted Worker secrets: `STRIPE_SECRET_KEY` (a live restricted key with Checkout Sessions Read access), `STRIPE_WEBHOOK_SECRET`, `STRIPE_TEST_SECRET_KEY`, `STRIPE_TEST_WEBHOOK_SECRET`, `DOWNLOAD_SIGNING_SECRET`, and (for Gmail delivery) `MAIL_BRIDGE_SECRET`. Add `MAIL_BRIDGE_URL` after deploying the Google Apps Script web app. All signing secrets must be independent random values. Never put them in GitHub, frontend JavaScript, URLs, or build logs.

Configure Stripe sandbox webhook `/webhook?mode=test` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. The server retrieves the canonical Checkout Session and validates paid status, environment, Payment Link, price, quantity, currency and total. Delayed payments do not grant access before confirmation.

Deploy `gmail/Code.gs` as a Google Apps Script web app that executes as the Gmail account owner. Save `MAIL_BRIDGE_SECRET` in Script Properties, authorize MailApp, and allow signed server requests to the web app. It sends mail without reading the inbox. Check the account's current sending quota before launch. For a domain-based sender, the optional Resend transport uses `EMAIL_API_KEY` and `EMAIL_FROM` instead.

The Durable Object stores one fulfillment record per environment and Checkout Session, serializes duplicate events, and retries transient email errors. The mail bridge also records delivery IDs. An ambiguous Gmail send is held for review rather than sent twice. Gmail retries can continue for six days to allow daily quota recovery; the optional Resend path stops after 22 hours to stay within its idempotency window. Review any order with `attention: true`. Signing links expire after seven days. Keep Durable Object fulfillment records so old webhook retries remain idempotent.

## Verification before live sales

Run `npm test`. Then buy each sandbox product using Stripe test payment details and confirm the actual PDF matches the purchased product. Test delivery after closing checkout, duplicate webhook events, pending/delayed payment, invalid signatures and expired tokens. Verify the Gmail message and its download link in an actual inbox. Local tests use Stripe and mail doubles and do not replace this end-to-end check.

Only after those checks, create live prices and Payment Links, update the catalog and frontend links, configure independent live API/webhook secrets, and deliberately set `LIVE_ENABLED=true` in both Worker and frontend. The production catalog and frontend now contain live product IDs and Payment Links; secret values remain only in Cloudflare.

