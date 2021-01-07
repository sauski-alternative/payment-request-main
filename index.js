const status = document.querySelector('#status');

function buildPaymentRequest() {
  if (!window.PaymentRequest) {
    return null;
  }

  // This needs to provide a manifest link HTTP header property, it does not
  // currently.
  const supportedInstruments = [{
    supportedMethods: ['https://sauski.github.com/payment-request-driveby/manifest.json']
  }
  ];

  const details = {
    total: {
      label: 'Donation',
      amount: {
        currency: 'USD',
        value: '55.00',
      },
    },
    displayItems: [{
      label: 'Original donation amount',
      amount: {
        currency: 'USD',
        value: '65.00',
      },
    }, {
      label: 'Friends and family discount',
      amount: {
        currency: 'USD',
        value: '-10.00',
      },
    }],
  };

  let request = null;

  try {
    request = new PaymentRequest(supportedInstruments, details);
    if (request.canMakePayment) {
      request.canMakePayment().then(function(result) {
        info(result ? 'Can make payment' : 'Cannot make payment');
      }).catch(function(err) {
        status.textContent = err;
      });
    }
    if (request.hasEnrolledInstrument) {
      request.hasEnrolledInstrument().then(function(result) {
        info(result ? 'Has enrolled instrument' : 'No enrolled instrument');
      }).catch(function(err) {
        status.textContent = err;
      });
    }
  } catch (e) {
    status.textContent = 'Developer mistake: \'' + e.message + '\'';
  }

  return request;
}

let request = buildPaymentRequest();

function handlePaymentResponse(response) {
    response.complete('success')
      .then(function() {
        done('This is a demo website. No payment will be processed.', response);
      })
      .catch(function(err) {
        status.textContent = err;
        request = buildPaymentRequest();
      });
}


function onBuyClicked() {
  if (!window.PaymentRequest || !request) {
    status.textContent ='PaymentRequest API is not supported.';
    return;
  }

  try {
    request.show()
      .then(handlePaymentResponse)
      .catch(function(err) {
        status.textContent = err;
        request = buildPaymentRequest();
      });
  } catch (e) {
    status.textContent = 'Developer mistake: \'' + e.message + '\'';
    request = buildPaymentRequest();
  }
}
