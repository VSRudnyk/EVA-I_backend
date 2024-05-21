const { createError } = require('../helpers');

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(createError(401, 'Wrong email or password'));
    }

    next();
  };
};

module.exports = validationMiddleware;
