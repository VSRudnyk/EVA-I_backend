const path = require('path');
const { verify } = require('../../helpers');
const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');

const { FRONT_URL, FRONT_LOCAL_URL } = process.env;

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });

  const isTokenExpired = verify(verificationCode, 'access');
  if (!isTokenExpired || !user) {
    return res.redirect(302, `${FRONT_URL}/verification?isTokenExpired=true`);
  } else if (user.verify) {
    return res.redirect(302, `${FRONT_URL}/verification?verified=true`);
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: null,
  });

  return res.redirect(302, `${FRONT_URL}/verification?verify=true`);
};

module.exports = verifyEmail;
