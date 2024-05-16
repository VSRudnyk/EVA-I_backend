const { User } = require('../../models/users.model');

const verifyPassToken = async (req, res) => {
  const { resetPasswordToken } = req.params;

  const user = await User.findOne({ resetPasswordToken });

  if (!user) {
    res.send({ token: null });
  }
  res.send({ token: true });
};

module.exports = verifyPassToken;
