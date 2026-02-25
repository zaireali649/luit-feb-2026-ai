# Payment landing — what we built

Summary of the payment-landing project and decisions made (for future you or AI context).

## What this is

A static, conversion-focused checkout page at **`payment-landing/`** (repo root). One HTML page, one CSS file, one JS file. No build step. Open `index.html` in a browser or serve the folder.

## Flow

1. **Landing** — User enters an amount (price input with $), sees four payment options: Cash App, Venmo, Klarna, PayPal. Trust strip, social proof, “Popular” on Klarna.
2. **Checkout** — Confirm payment method and amount; primary CTA: “Complete payment — $X.XX”.
3. **Success** — Thank-you state with amount paid.

For **Cash App** and **Venmo**, “Complete payment” opens the real pay link in a new tab (amount pre-filled), then the page shows the success view. **Klarna** and **PayPal** are demo-only (no real redirect).

## Your payment identities

- **Cash App:** `$codeali` → stored as `CASH_APP_CASHTAG = 'codeali'` in `script.js`. Pay link: `https://cash.app/$codeali/{amount}`.
- **Venmo:** `@codeali` → stored as `VENMO_USERNAME = 'codeali'` in `script.js`. Pay link: `https://venmo.com/codeali?txn=pay&amount={amount}`.

Change either by editing the constants at the top of `script.js`.

## UX details

- **Price input:** Focus selects all so the first keypress replaces the default “0” instead of appending.
- **Redirect note:** When Cash App or Venmo is selected, checkout shows “You’ll complete payment in the [Cash App|Venmo] app.”
- **Logos:** Cash App from VectorSeek URL; Venmo/PayPal from Wikimedia Commons; Klarna from Klarna CDN.

## Design choices

- Single white checkout panel on dark gradient background for focus and conversion.
- Order summary at top (amount) as commitment anchor; trust strip (lock + “Secure checkout”); reassurance copy.
- Payment cards are clear CTAs (“Pay with [provider]”); hover lift and shadow.

## Files

- `index.html` — Structure and copy; three views (landing, checkout, success).
- `styles.css` — Layout, payment grid, buttons, trust/reassurance, price input.
- `script.js` — View switching, amount handling, Cash App/Venmo redirect URLs, select-all on price focus.
