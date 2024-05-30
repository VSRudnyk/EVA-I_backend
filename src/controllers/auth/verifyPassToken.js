const { User } = require('../../models/users.model');
const { verify } = require('../../helpers');

const { FRONT_URL, FRONT_LOCAL_URL } = process.env;

const verifyPassToken = async (req, res) => {
  const { resetPasswordToken } = req.params;

  const isTokenExpired = verify(resetPasswordToken, 'access');

  const user = await User.findOne({ resetPasswordToken });

  if (!isTokenExpired && user) {
    console.log('token has expared, redirect to front');
    user.resetPasswordToken = null;
    await user.save();
    res.redirect(`${FRONT_LOCAL_URL}/reset-password?tokenExpired=true`);
  }
  if ((!isTokenExpired && !user) || (isTokenExpired && !user)) {
    console.log('token empty in database, redirect to front');
    res.redirect(`${FRONT_LOCAL_URL}/reset-password?usedLink=true`);
  }
  console.log('token has not expare, redirect to front');
  res.redirect(`${FRONT_LOCAL_URL}/reset-password?token=${resetPasswordToken}`);
};

module.exports = verifyPassToken;
