# Payment landing — tasks

Quick reference for what’s done and how to change things.

## Done

- [x] New `payment-landing/` at repo root (static site only).
- [x] Landing: headline, subtitle, four payment cards (Cash App, Venmo, Klarna, PayPal).
- [x] Real logos: Cash App (VectorSeek), Venmo/PayPal (Wikimedia), Klarna (CDN).
- [x] Conversion pass: order summary, trust strip, social proof, “Popular” on Klarna, reassurance copy, dark bg + white panel.
- [x] Editable amount: price input with $; value used in checkout and success.
- [x] Price input: select-all on focus so typing replaces “0”.
- [x] Real Cash App: pay link to `$codeali`, amount in URL; opens in new tab on confirm.
- [x] Real Venmo: pay link to @codeali, amount in query; opens in new tab on confirm.
- [x] Single redirect note for Cash App and Venmo on checkout.

## To change

| What | Where |
|------|--------|
| Cash App cashtag | `script.js` → `CASH_APP_CASHTAG` |
| Venmo username | `script.js` → `VENMO_USERNAME` |
| Copy / trust / reassurance | `index.html` + `styles.css` |
| Which option is “Popular” | `index.html` → add/remove `payment-card--popular` on a card |

## Optional later

- [ ] Real Klarna or PayPal (would need their merchant/pay-link flows or APIs).
- [ ] Optional note in Venmo URL (e.g. `&note=...`).
- [ ] Success view: different copy or link after Cash App/Venmo redirect.

## Run

Open `payment-landing/index.html` in a browser, or serve the folder (e.g. `npx serve payment-landing`).
