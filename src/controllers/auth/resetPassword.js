const bcrypt = require('bcryptjs');
const { User } = require('../../models/users.model');

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(404).json({
        message: 'Invalid token, user not found',
      });
    }

    const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    user.password = hashPassword;
    user.resetPasswordToken = '';
    await user.save();
    const { password: userPassword, ...userResponse } = user._doc;
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

module.exports = resetPassword;
