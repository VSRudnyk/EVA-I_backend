const path = require('path');
const { verify } = require('../../helpers');
const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');

const { FRONT_URL, FRONT_LOCAL_URL } = process.env;

const verifyEmail = async (req, res) => {
  const { id, verificationCode } = req.params;

  const user = await User.findOne({ _id: id });

  verify(verificationCode, 'access');

  if (!user) {
    throw createError(
      401,
      'Sorry, can’t find an account associated with this address'
    );
  } else if (user.verify) {
    res.redirect(`${FRONT_LOCAL_URL}/registration?verify=true`);
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: '',
  });
  res.redirect(`${FRONT_LOCAL_URL}/registration`);
};

module.exports = verifyEmail;
