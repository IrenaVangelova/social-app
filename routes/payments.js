var express = require('express');
var router = express.Router();
const controller = require('../controllers/payments');
const jwt = require('express-jwt');
const response = require('../lib/response_handler');

router.use(
  jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ['HS256'],
  })
);

router.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === 'UnauthorizedError') {
    response(res, 401, 'Unauthorized access');
  }
});

router
  .post('/authorize', controller.authorize)
  .post('/capture/:id', controller.capture)
  .post('/void/:id', controller.void)
  .post('/refund/:id', controller.refund)

module.exports = router;