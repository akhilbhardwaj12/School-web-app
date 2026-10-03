const stripe = require("stripe");
const ENV = require('./env');

if(!ENV.STRIPE_API_KEY || !ENV.STRIPE_PUBLISHABLE_KEY) {
    console.warn('STRIPE_API_KEY or STRIPE_PUBLISHABLE_KEY is not set - Stripe payments will fail.')

}
const stripe = new StripeConstructor(ENV.STRIPE_API_KEY);

module.exports = stripe;