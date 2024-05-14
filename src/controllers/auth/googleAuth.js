const { sign } = require('../../helpers');
const { User } = require('../../models/users.model');

const { FRONT_LOCAL_URL, FRONT_URL } = process.env;

const googleAuth = async (req, res) => {
  const { _id: id } = req.user;

  console.log(id);

  const payload = {
    id,
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
    `${FRONT_URL}/wait-list`
  );
};

module.exports = googleAuth;
