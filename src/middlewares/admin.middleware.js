const { createError } = require('../helpers/index');
const { User } = require('../models/users.model');
const pinoLogger = require('../../logger');

const adminMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user.role != 'Admin') {
      pinoLogger.error("User doesn't have access rights to the content");
      next(createError(403, "User doesn't have access rights to the content"));
    }
    next();
  } catch (error) {
    pinoLogger.error("User doesn't have access rights to the content");
    next(createError(403, "User doesn't have access rights to the content"));
  }
};

module.exports = adminMiddleware;
