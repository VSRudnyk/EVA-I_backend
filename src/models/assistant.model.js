const { Schema, model } = require('mongoose');
const Joi = require('joi');

const assistantSchema = new Schema(
  {
    owner: {
      type: String,
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    welcomeMessage: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    assistantTheme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
  },
  { versionKey: false, timestamps: true }
);

const createAssistantSchema = Joi.object({
  icon: Joi.string().required(),
  color: Joi.string().required(),
  description: Joi.string().required(),
  welcomeMessage: Joi.string().required(),
  name: Joi.string().required(),
  assistantTheme: Joi.string().required(),
});

const updateAssistantSchema = Joi.object({
  owner: Joi.string(),
  icon: Joi.string(),
  color: Joi.string(),
  description: Joi.string(),
  welcomeMessage: Joi.string(),
  name: Joi.string(),
  assistantTheme: Joi.string(),
});

const Assistant = model('assistant', assistantSchema);

module.exports = {
  Assistant,
  createAssistantSchema,
  updateAssistantSchema,
};
