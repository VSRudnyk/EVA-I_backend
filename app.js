require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const logger = require('morgan');
var cors = require('cors');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRouter = require('./src/routes/auth');
const waitListRouter = require('./src/routes/waitList');
const assistantsRouter = require('./src/routes/assistants');
const { errorFilter } = require('./src/middlewares');
const limiter = require('./src/helpers/expressRateLimit');

const { SECRET_SESSION_KEY } = process.env;

const app = express();
app.set('trust proxy', 1);
app.get('/ip', (request, response) => response.send(request.ip));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Only from the same source
      frameAncestors: ["'self'", 'https://evatest-2aebdf1ed009.herokuapp.com'], // Only from certain sources
      scriptSrc: ["'self'", "'unsafe-inline'"], // Example of setup for scripts
      objectSrc: ["'none'"], // Prevents loading of objects (eg flash)
      upgradeInsecureRequests: [], // Forces HTTPS for all resources
    },
  }),
  helmet.noSniff(), // Protection against MIME attacks
  helmet.referrerPolicy({ policy: 'no-referrer' }) // Referrer Policy

  // START ----------------- settings that work if the backend and frontend are on the same resource -----------------

  // helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }), // Content Isolation
  // helmet.crossOriginResourcePolicy({ policy: 'same-site' }) // Resource Policy

  // END
);

app.use(logger('dev'));

// START ----------------- must be enabled before release if backend is located on eva-i.com -----------------

// const corsOptions = {
//   origin: 'https://eva-i.com',
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

// END

// START ----------------- must be enabled before release if the backend is NOT located on eva-i.com -----------------
// const allowedOrigins = [
//   'https://eva-i.com',
//   'http://localhost:5173',
//   'http://localhost:3000',
//   'https://eva-i-backend.vercel.app/',
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   allowedHeaders: 'Content-Type, Authorization',
// };

app.use(cors());

// END

app.use(express.json());
app.use(
  session({
    secret: SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', limiter, authRouter);
app.use('/api/waitlist', waitListRouter);
app.use('/api/assistants', assistantsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorFilter);

module.exports = app;
