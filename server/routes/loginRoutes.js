const router = require('express').Router();
const path = require('path');
const loginControllers = require('../controllers/loginControllers');
const cookieControllers = require('../controllers/cookieControllers');

router.post(
  '/',
  loginControllers.verifyUser,
  loginControllers.verifyAdopterOrCat,
  cookieControllers.setCookie, (req, res) => {
    return res.status(200).json(res.locals);
  }
);

router.post('/getAccountType', loginControllers.getAccountType, (req, res) => {
  res.json(res.locals.accountType);
});

router.post(
  '/createAdopterProfile',
  loginControllers.createAdopter,
  (req, res) => {
    return res.status(200).json(res.locals._id);
  }
);

router.post('/createCatProfile', loginControllers.createCat, (req, res) => {
  return res.status(200).json(res.locals._id);
});

module.exports = router;
