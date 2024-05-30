const { User } = require('../../models/users.model');
const { verify } = require('../../helpers');

const { FRONT_URL, FRONT_LOCAL_URL } = process.env;

const verifyPassToken = async (req, res) => {
  const { resetPasswordToken } = req.params;

  const isTokenExpired = verify(resetPasswordToken, 'access');

  const user = await User.findOne({ resetPasswordToken });

  if (!isTokenExpired && user) {
    user.resetPasswordToken = null;
    await user.save();
    res.redirect(`${FRONT_URL}/reset-password?tokenExpired=true`);
  }
  if ((!isTokenExpired && !user) || (isTokenExpired && !user)) {
    res.redirect(`${FRONT_URL}/reset-password?usedLink=true`);
  }
  res.redirect(`${FRONT_URL}/reset-password?token=${resetPasswordToken}`);
};

module.exports = verifyPassToken;
