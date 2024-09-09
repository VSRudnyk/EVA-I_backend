const express = require('express');
const controllerWrapper = require('../helpers/controllerWrapper');
const auth = require('../controllers/auth/index');
const router = express.Router();
const {
  validationMiddleware,
  authorizeMiddleware,
  passport,
} = require('../middlewares');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  resendEmailSchema,
} = require('../models/users.model');

router.post(
  '/register',
  validationMiddleware(registerSchema),
  controllerWrapper(auth.register)
);
router.post(
  '/login',
  validationMiddleware(loginSchema),
  controllerWrapper(auth.login)
);

router.get('/logout', authorizeMiddleware, controllerWrapper(auth.logout));

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  auth.googleAuth
);

router.get('/current', authorizeMiddleware, controllerWrapper(auth.getCurrent));

router.post(
  '/resend',
  validationMiddleware(resendEmailSchema),
  controllerWrapper(auth.resendEmail)
);

router.get('/verify/:verificationCode', controllerWrapper(auth.verifyEmail));

router.get(
  '/verify-token/:resetPasswordToken',
  controllerWrapper(auth.verifyPassToken)
);

router.post(
  '/forgot-password',
  validationMiddleware(forgotPasswordSchema),
  controllerWrapper(auth.forgotPassword)
);

router.post(
  '/reset-password/:token',
  validationMiddleware(resetPasswordSchema),
  controllerWrapper(auth.resetPassword)
);

router.post(
  '/refresh',
  validationMiddleware(refreshTokenSchema),
  controllerWrapper(auth.refreshToken)
);

router.post('/upload', controllerWrapper(auth.upload));

module.exports = router;
