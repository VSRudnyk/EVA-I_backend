const logger = require('../../../logger');
const { User } = require('../../models/users.model');

const getCurrent = async (req, res) => {
  const id = req.user._id;
  const currentUser = await User.findById(id).select('-password');
  logger.info('Get current user');
  res.status(200).json(currentUser);
};

module.exports = getCurrent;
