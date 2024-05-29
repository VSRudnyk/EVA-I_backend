const { User } = require('../../models/users.model');

const { FRONT_URL, FRONT_LOCAL_URL } = process.env;

const verifyPassToken = async (req, res) => {
  const { resetPasswordToken } = req.params;

  const user = await User.findOne({ resetPasswordToken });

  if (!user) {
    res.redirect(`${FRONT_LOCAL_URL}/reset-password?changed=true`);
  }
  res.redirect(`${FRONT_LOCAL_URL}/reset-password?changed=false`);
};

module.exports = verifyPassToken;
