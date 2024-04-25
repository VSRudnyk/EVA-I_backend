const jwt = require('jsonwebtoken');

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const sign = (payload, secret_key, expiresIn) => {
  return jwt.sign(
    payload,
    secret_key === 'access' ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY,
    { expiresIn }
  );
};

const verify = (token, secret_key) => {
  try {
    return jwt.verify(
      token,
      secret_key === 'access' ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  sign,
  verify,
};
