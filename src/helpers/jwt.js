const jwt = require('jsonwebtoken');

const { ACCESS_SECRET_KEY } = process.env;

const sign = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '10000m' });
};

const verify = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET_KEY);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  sign,
  verify,
};
