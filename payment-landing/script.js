(function () {
  var landing = document.getElementById('landing');
  var checkout = document.getElementById('checkout');
  var success = document.getElementById('success');
  var chosenProviderEl = document.getElementById('chosen-provider');
  var priceInput = document.getElementById('price-input');
  var checkoutAmount = document.getElementById('checkout-amount');
  var confirmAmount = document.getElementById('confirm-amount');
  var successAmount = document.getElementById('success-amount');
  var confirmPay = document.getElementById('confirm-pay');
  var backToOptions = document.getElementById('back-to-options');
  var startOver = document.getElementById('start-over');
  var paymentRedirectNote = document.getElementById('payment-redirect-note');
  var cards = document.querySelectorAll('.payment-card');
  var chosenProvider = '';

  var CASH_APP_CASHTAG = 'codeali';
  var VENMO_USERNAME = 'codeali';

  function getAmount() {
    var raw = priceInput ? parseFloat(priceInput.value, 10) : 0;
    var num = isNaN(raw) || raw < 0 ? 0 : raw;
    return num.toFixed(2);
  }

  function getFormattedAmount() {
    return '$' + getAmount();
  }

  function show(view) {
    landing.classList.remove('active');
    checkout.classList.remove('active');
    success.classList.remove('active');
    view.classList.add('active');
    var formatted = getFormattedAmount();
    if (checkoutAmount) checkoutAmount.textContent = formatted;
    if (confirmAmount) confirmAmount.textContent = formatted;
    if (successAmount) successAmount.textContent = formatted;
    if (paymentRedirectNote) {
      if (chosenProvider === 'Cash App') {
        paymentRedirectNote.textContent = "You'll complete payment in the Cash App app.";
        paymentRedirectNote.style.display = 'block';
      } else if (chosenProvider === 'Venmo') {
        paymentRedirectNote.textContent = "You'll complete payment in the Venmo app.";
        paymentRedirectNote.style.display = 'block';
      } else {
        paymentRedirectNote.style.display = 'none';
      }
    }
  }

  function setChosen(provider) {
    chosenProvider = provider || '';
    if (chosenProviderEl) chosenProviderEl.textContent = provider;
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var provider = card.getAttribute('data-provider');
      setChosen(provider);
      show(checkout);
    });
  });

  if (confirmPay) {
    confirmPay.addEventListener('click', function () {
      var amount = getAmount();
      if (chosenProvider === 'Cash App') {
        var cashAppUrl = 'https://cash.app/$' + CASH_APP_CASHTAG + '/' + amount;
        window.open(cashAppUrl, '_blank', 'noopener,noreferrer');
      } else if (chosenProvider === 'Venmo') {
        var venmoUrl = 'https://venmo.com/' + VENMO_USERNAME + '?txn=pay&amount=' + amount;
        window.open(venmoUrl, '_blank', 'noopener,noreferrer');
      }
      show(success);
    });
  }

  if (backToOptions) {
    backToOptions.addEventListener('click', function () {
      show(landing);
    });
  }

  if (startOver) {
    startOver.addEventListener('click', function () {
      show(landing);
    });
  }

  if (priceInput) {
    priceInput.addEventListener('focus', function () {
      priceInput.select();
    });
  }
})();
