const { createError } = require('../helpers/index');
const { verify } = require('../helpers/index');
const { Assistant } = require('../models/assistant.model');

const authAssistantMiddleware = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    next(createError(401, 'Authorization header is invalid'));
  }

  try {
    const { id } = verify(token, 'access');
    const assistantData = await Assistant.findById(id);

    if (!assistantData.token) {
      next(createError(401, 'Not authorized'));
    }
    req.assistantData = assistantData;
    next();
  } catch (error) {
    next(createError(401, 'Token is invalid'));
  }
};

module.exports = authAssistantMiddleware;
