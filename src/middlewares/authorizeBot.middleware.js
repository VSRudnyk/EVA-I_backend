const { createError } = require('../helpers/index');
const { verify } = require('../helpers/index');
const { Database } = require('../models/database.model');

const { ACCESS_SECRET_KEY } = process.env;
const authorizeMiddleware = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    next(createError(401, 'Authorization header is invalid'));
  }

  try {
    const { id } = verify(token, ACCESS_SECRET_KEY);
    const botDatabase = await Database.findById(id);

    if (!botDatabase.token) {
      next(createError(401, 'Not authorized'));
    }
    req.botDatabase = botDatabase;
    next();
  } catch (error) {
    next(createError(401, 'Token is invalid'));
  }
};

module.exports = authorizeMiddleware;
