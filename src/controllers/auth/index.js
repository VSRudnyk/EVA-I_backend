const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const verifyEmail = require('./verifyEmail');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');
const refreshToken = require('./refreshToken');
const googleAuth = require('./googleAuth');
const getCurrent = require('./getCurrent');
const resendEmail = require('./resendEmail');

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleAuth,
  getCurrent,
  resendEmail,
};
