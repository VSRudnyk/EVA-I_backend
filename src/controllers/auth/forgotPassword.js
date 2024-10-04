const { sign } = require('../../helpers');
const { User } = require('../../models/users.model');
const { sendSmtpEmail } = require('../../helpers/sendSmtpEmail');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
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
      '15m'
    );

    user.resetPasswordToken = token;
    await user.save();
    const { password, ...userResponse } = user._doc;

    await sendSmtpEmail(email, token, user._id, '/forgot-password');
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = forgotPassword;
