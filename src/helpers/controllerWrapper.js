const pinoLogger = require('../../logger');

const controllerWrapper = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      pinoLogger.error(error);
      next(error);
    }
  };
};

module.exports = controllerWrapper;
