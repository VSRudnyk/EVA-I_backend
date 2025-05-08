const register = require('./register');
const registerCollaborators = require('./registerCollaborators');
const login = require('./login');
const logout = require('./logout');
const verifyEmail = require('./verifyEmail');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');
const refreshToken = require('./refreshToken');
const googleAuth = require('./googleAuth');
const getCurrent = require('./getCurrent');
const resendEmail = require('./resendEmail');
const verifyPassToken = require('./verifyPassToken');
const updateTariffPlan = require('./updateTariffPlan');

module.exports = {
  register,
  registerCollaborators,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleAuth,
  getCurrent,
  resendEmail,
  verifyPassToken,
  updateTariffPlan,
};
