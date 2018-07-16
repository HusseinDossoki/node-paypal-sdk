const router = require('express').Router();
const paypal = require('paypal-rest-sdk');


router.get('/', (req, res) => {
  res.render('index');
});


router.post('/pay', (req, res) => {
  
  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Some product",
          "sku": "001",
          "price": "25.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "25.00"
      },
      "description": "This is the payment description."
    }]
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) throw error;
    
    payment.links.forEach(link => {
      if(link.rel === 'approval_url'){
        res.redirect(link.href);
      }
    });

  });

});


router.get('/success', (req, res) => {

  const payerId   = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {"currency": "USD", "total": "25.00"}
    }]
  }

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) throw error;

    res.send('success payment');

  });

});


router.get('/cancel', (req, res) => {
  res.send('cancelled');
});

module.exports = router;