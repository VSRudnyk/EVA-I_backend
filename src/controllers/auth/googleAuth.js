const { sign } = require('../../helpers');
const { User } = require('../../models/users.model');

const { FRONT_LOCAL_URL, FRONT_URL, NODE_ENV } = process.env;
const dev_mode = NODE_ENV === 'development'

const googleAuth = async (req, res) => {
  const user = req.user;

  if (user.fromGoogle) {
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      // Add any other needed data
    });
  }

  const { _id: id } = user;
  const payload = {
    id,
    uniqueValue: Date.now(),
  };

  const accessToken = sign(payload, 'access', '1d');
  const refreshToken = sign(payload, 'refresh', '7d');
  await User.findByIdAndUpdate(id, {
    accessToken,
    refreshToken,
    verify: true,
  });
  res.redirect(
    // `${FRONT_LOCAL_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`
    `${dev_mode ? FRONT_LOCAL_URL :FRONT_URL}/wait-list`
  );
};

module.exports = googleAuth;
