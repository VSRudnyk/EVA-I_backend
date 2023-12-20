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
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User'
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: '',
    },
    resetPasswordToken: {
      type: String,
      default: '',
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .message('Invalid format. Must contain @')
    .required(),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])[A-Za-z0-9\W_]{8,}$/)
    .message(
      'Password must contain at least 8 characters, including at least 1 uppercase letter, 1 number and 1 symbol'
    ),
  name: Joi.string().optional(),
});
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .message('Invalid format. Must contain @')
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])[A-Za-z0-9\W_]{8,}$/)
    .message(
      'Password must contain at least 8 characters, including at least 1 uppercase letter, 1 number and 1 symbol'
    )
    .required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .message('Invalid format. Must contain @')
    .required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])[A-Za-z0-9\W_]{8,}$/)
    .message(
      'Password must contain at least 8 characters, including at least 1 uppercase letter, 1 number and 1 symbol'
    )
    .required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const User = model('user', userSchema);

module.exports = {
  User,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
};
