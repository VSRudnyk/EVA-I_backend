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

const SECRET_SESSION_KEY = process.env.SECRET_SESSION_KEY;

const app = express();
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Только с того же источника
      frameAncestors: ["'self'", 'https://evatest-2aebdf1ed009.herokuapp.com'], // Только с определенных источников
      scriptSrc: ["'self'", "'unsafe-inline'"], // Пример настройки для скриптов
      objectSrc: ["'none'"], // Запрещает загрузку объектов (например, flash)
      upgradeInsecureRequests: [], // Принудительно использует HTTPS для всех ресурсов
    },
  }),
  helmet.noSniff(), // Защита от MIME атак
  helmet.referrerPolicy({ policy: 'no-referrer' }) // Политика Referrer
  // helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }), // Изоляция контента
  // helmet.crossOriginResourcePolicy({ policy: 'same-site' }) // Политика ресурсов
);
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       frameAncestors: ["'self'", 'http://localhost:5173/widget/'],
//     },
//   }),
// );

app.use(logger('dev'));

// const corsOptions = {
//   origin: 'https://eva-i.com',
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

const allowedOrigins = [
  'https://eva-i.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://eva-i-backend.vercel.app/',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));

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

app.use('/api/auth', authRouter);
app.use('/api/waitlist', waitListRouter);
app.use('/api/assistants', assistantsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorFilter);

module.exports = app;
