const model = require('../models/models.js');

const cookieControllers = {};

cookieControllers.setCookie = async (req, res, next) => {
  if (res.locals.googleUser) {
    return next();
  }
  const email = req.body.email;
  try {
    const user = await model.User.findOne({ email });
    const userID = user._id.toString();
    console.log('* Setting cookie userID:', userID);
    res.cookie('id', userID);
    return next();
  } catch (err) {
    console.log('error: ', err);
  }
};

module.exports = cookieControllers;
