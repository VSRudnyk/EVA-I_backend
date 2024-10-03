const { Schema, model } = require('mongoose');
const Joi = require('joi');

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
    tariffPlan: {
      type: String,
      enum: [null, 'free', 'standart', 'pro', 'enterprise'],
      default: null,
      required: false,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    expireAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    // .message('Invalid domains name')
    .required(),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])[A-Za-z0-9\W_]{8,16}$/)
    .message(
      'Password must contain at least 8 and not more than 16 characters, including at least 1 uppercase letter, 1 number and 1 symbol'
    ),
  name: Joi.string().optional(),
});
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('Wrong email or password')
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])[A-Za-z0-9\W_]{8,16}$/)
    .message('Wrong email or password')
    .required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    // .message('Invalid domains name')
    .required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])[A-Za-z0-9\W_]{8,16}$/)
    .message(
      'Password must contain at least 8 and not more than 16 characters, including at least 1 uppercase letter, 1 number and 1 symbol'
    )
    .required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const resendEmailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    // .message('Invalid domains name')
    .required(),
  action: Joi.string().optional(),
});

const updateTariffPlanSchema = Joi.object({
  tariffPlan: Joi.string().required(),
});

const User = model('user', userSchema);

User.collection.createIndex(
  { expireAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { verify: false } }
);

module.exports = {
  User,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  resendEmailSchema,
  updateTariffPlanSchema,
};
