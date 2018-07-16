const express       = require('express');
const ejs           = require('ejs');
const paypal        = require('paypal-rest-sdk');
const path          = require('path');
const paypalConfig  = require('./config/paypal');

// define the app
const app = express();

// setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));


// paypal config
paypal.configure(paypalConfig);


// define the route
const paypalRoute = require('./routes/paypal');
app.use('/', paypalRoute);


// start the serve
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server runs on port ${port} ....`);
});