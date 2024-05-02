const bcrypt = require('bcryptjs');
const { sign } = require('../../helpers');
const { User } = require('../../models/users.model');
const { sendSmtpEmail } = require('../../helpers/sendSmtpEmail');

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
    },
    'access',
    '1m'
  );

  let updatedUser;

  if (action === '/forgot-password') {
    updatedUser = await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: token,
    });
  } else if (action === '/registration') {
    updatedUser = await User.findByIdAndUpdate(user._id, {
      verificationCode: token,
    });
  }

  const { password: userPassword, _id, ...userResponse } = updatedUser._doc;
  const userId = _id.toString();

  try {
    await sendSmtpEmail(email, token, userId, action);
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = resendEmail;
