const { Schema, model } = require('mongoose');
const Joi = require('joi');

const assistantSchema = new Schema(
  {
    owner: {
      type: String,
    },
    icon: {
      type: String,
    },
    iconId: {
      type: String,
    },
    color: {
      type: String,
    },
    description: {
      type: String,
    },
    welcomeMessage: {
      type: String,
    },
    name: {
      type: String,
    },
    assistantTheme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    language: {
      type: String,
      enum: ['en', 'ua'],
      default: 'en',
    },
  },
  { versionKey: false, timestamps: true }
);

const createAssistantSchema = Joi.object({
  icon: Joi.string().required(),
  color: Joi.string().required(),
  welcomeMessage: Joi.string()
    .required()
    .min(2)
    .max(200)
    .pattern(
      /^[a-zA-Zа-яґєіїйёыъэА-ЯҐЄІЇЙЁЫЪЭ0-9\s.,!?@"'№#%&$^*<>()/{}\-_+=;:'"~|\\[\]]*$/
    ),
  description: Joi.string()
    .allow('')
    .max(200)
    .pattern(
      /^[a-zA-Zа-яґєіїйёыъэА-ЯҐЄІЇЙЁЫЪЭ0-9\s.,!?@"'№#%&$^*<>()/{}\-_+=;:'"~|\\[\]]*$/
    ),
  name: Joi.string()
    .required()
    .min(2)
    .max(35)
    .pattern(
      /^[a-zA-Zа-яґєіїйёыъэА-ЯҐЄІЇЙЁЫЪЭ0-9\s.,!?@"'№#%&$^*<>()/{}\-_+=;:'"~|\\[\]]*$/
    ),
  assistantTheme: Joi.string().required(),
});

const updateAssistantSchema = Joi.object({
  owner: Joi.string(),
  icon: Joi.string(),
  color: Joi.string(),
  description: Joi.string()
    .allow('')
    .max(200)
    .pattern(
      /^[a-zA-Zа-яґєіїйёыъэА-ЯҐЄІЇЙЁЫЪЭ0-9\s.,!?@"'№#%&$^*<>()/{}\-_+=;:'"~|\\[\]]*$/
    ),
  welcomeMessage: Joi.string()
    .min(2)
    .max(200)
    .pattern(
      /^[a-zA-Zа-яґєіїйёыъэА-ЯҐЄІЇЙЁЫЪЭ0-9\s.,!?@"'№#%&$^*<>()/{}\-_+=;:'"~|\\[\]]*$/
    ),
  name: Joi.string()
    .min(2)
    .max(35)
    .pattern(
      /^[a-zA-Zа-яґєіїйёыъэА-ЯҐЄІЇЙЁЫЪЭ0-9\s.,!?@"'№#%&$^*<>()/{}\-_+=;:'"~|\\[\]]*$/
    ),
  assistantTheme: Joi.string(),
});

const Assistant = model('assistant', assistantSchema);

module.exports = {
  Assistant,
  createAssistantSchema,
  updateAssistantSchema,
};
