const { User } = require('../../models/users.model');
const { verify } = require('../../helpers');

const { FRONT_URL, FRONT_LOCAL_URL, NODE_ENV } = process.env;
const dev_mode = NODE_ENV === 'development'

const verifyPassToken = async (req, res) => {
  const { resetPasswordToken } = req.params;

  const isTokenExpired = verify(resetPasswordToken, 'access');

  const user = await User.findOne({ resetPasswordToken });

  if (!isTokenExpired && user) {
    user.resetPasswordToken = null;
    await user.save();
    res.redirect(`${dev_mode ? FRONT_LOCAL_URL :FRONT_URL}/reset-password?tokenExpired=true`);
  }
  if ((!isTokenExpired && !user) || (isTokenExpired && !user)) {
    res.redirect(`${dev_mode ? FRONT_LOCAL_URL :FRONT_URL}/reset-password?usedLink=true`);
  }
  res.redirect(`${dev_mode ? FRONT_LOCAL_URL :FRONT_URL}/reset-password?token=${resetPasswordToken}`);
};

module.exports = verifyPassToken;
