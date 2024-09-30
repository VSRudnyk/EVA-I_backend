const { Schema, model } = require('mongoose');
const Joi = require('joi');

const assistantSchema = new Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    tariffPlan: {
      type: String,
      enum: ['start', 'pro', 'max'],
      default: 'start',
      required: true,
    },
    icon: {
      type: String,
      default: '',
      required: true,
    },
    color: {
      type: String,
      default: '',
      required: true,
    },
    description: {
      type: String,
      default: '',
      required: true,
    },
    welcomeMessage: {
      type: String,
      default: '',
      required: true,
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
    assistantTheme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const createAssistantSchema = Joi.object({
  tariffPlan: Joi.string().required(),
});

const updateAssistantSchema = Joi.object({
  owner: Joi.string().required(),
  tariffPlan: Joi.string().required(),
  icon: Joi.string().required(),
  color: Joi.string().required(),
  description: Joi.string().required(),
  welcomeMessage: Joi.string().required(),
  name: Joi.string().required(),
  assistantTheme: Joi.string().required(),
});

const Assistant = model('assistant', assistantSchema);

module.exports = {
  Assistant,
  createAssistantSchema,
  updateAssistantSchema,
};
