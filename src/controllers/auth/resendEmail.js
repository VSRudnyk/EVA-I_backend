const bcrypt = require('bcryptjs');
const { sign } = require('../../helpers');
const { User } = require('../../models/users.model');
const { sendSmtpEmail } = require('../../helpers');
const { createError } = require('../../helpers');

const resendEmail = async (req, res) => {
  const { email, action } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: 'Sorry, can’t find an account associated with this address',
    });
  }

  const token = sign(
    {
      userEmail: email,
      uniqueValue: Date.now(),
    },
    'access',
    '1m'
  );

  let updatedUser;

  if (action === '/reset-password') {
    updatedUser = await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: token,
    });
  } else if (action === '/verification') {
    updatedUser = await User.findByIdAndUpdate(user._id, {
      verificationCode: token,
    });
  } else {
    const error = createError(404, 'Wrong path in action');
    throw error;
  }

  const { password: userPassword, ...userResponse } = updatedUser._doc;

  try {
    await sendSmtpEmail(email, token, action);
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = resendEmail;
