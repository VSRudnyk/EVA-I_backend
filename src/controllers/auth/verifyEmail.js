const path = require('path');
const { verify } = require('../../helpers');
const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');

const { FRONT_URL, FRONT_LOCAL_URL } = process.env;

const verifyEmail = async (req, res) => {
  const { id, verificationCode } = req.params;

  const user = await User.findOne({ _id: id });

  const isTokenExpired = verify(verificationCode, 'access');
  if (!isTokenExpired) {
    res.redirect(`${FRONT_LOCAL_URL}/verification?isTokenExpired=true`);
  }
  if (!user) {
    throw createError(
      401,
      'Sorry, can’t find an account associated with this address'
    );
  } else if (user.verify) {
    res.redirect(`${FRONT_LOCAL_URL}/verification?verified=true`);
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: null,
  });

  res.redirect(`${FRONT_LOCAL_URL}/verification?verify=true`);
};

module.exports = verifyEmail;
