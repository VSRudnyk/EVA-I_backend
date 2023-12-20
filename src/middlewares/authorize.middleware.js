const { createError } = require('../helpers/index');
const { verify } = require('../helpers/index');
const { User } = require('../models/users.model');
const pinoLogger = require('../../logger');

const { ACCESS_SECRET_KEY } = process.env;
const authorizeMiddleware = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    pinoLogger.error('Authorization header is invalid');
    next(createError(401, 'Authorization header is invalid'));
  }

  try {
    const { id } = verify(token, ACCESS_SECRET_KEY);
    const user = await User.findById(id);

    if (!user.accessToken) {
      pinoLogger.error('Not authorized');
      next(createError(401, 'Not authorized'));
    }
    req.user = user;
    next();
  } catch (error) {
    pinoLogger.error('Token is invalid');
    next(createError(401, 'Token is invalid'));
  }
};

module.exports = authorizeMiddleware;
