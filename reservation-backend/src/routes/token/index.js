const router = require('express').Router();
const shared = require('../../shared');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // TEST API KEY

const WEB_URL = 'http://localhost:3000';


// router.post('/create-checkout-session', shared.asyncWrapper(async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
//         line_items: [
//             {
//                 price: '{{PRICE_ID}}',
//                 quantity: 1,
//             },
//         ],
//         mode: 'payment',
//         success_url: WEB_URL, // TODO make these pages on the front-end and go to them
//         cancel_url: WEB_URL, // TODO make these pages on the front-end and go to them
//     });

//     res.redirect(303, session.url);
// }));

module.exports = router;