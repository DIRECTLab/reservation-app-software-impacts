// This is where you actually define base routes, all the routes in the file
// example/index.js will be under /example, since we defined it below
// as you add new folders and routes, make sure this is updated
const router = require('express').Router();

// TODO: Add the rest of the routes here

router.use('/charger', require('./charger'));
router.use('/reservation', require('./reservation'));
router.use('/user', require('./user'));
router.use('/favorite', require('./favorite'));
router.use('/token', require('./token'));
router.use('/car', require('./car'));

module.exports = router;