const { rateLimit } = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

const { DB_URI } = process.env;

var keyGenerator = function (req /*, res*/) {
  console.log('Public Id --------->', req.publicIp);
  return req.publicIp; // or whatever we end up with
};

const limiter = rateLimit({
  store: new MongoStore({
    uri: DB_URI,
    expireTimeMs: 5 * 60 * 1000,
  }),
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  skipSuccessfulRequests: true, // to avoid counting successful requests in limit
  legacyHeaders: false,
  standardHeaders: false,
  keyGenerator: keyGenerator,
});

module.exports = limiter;
