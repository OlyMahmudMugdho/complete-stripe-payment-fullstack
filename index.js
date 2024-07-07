const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_xx'); // Replace with your test secret key
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
