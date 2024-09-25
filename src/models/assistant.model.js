const { Schema, model } = require('mongoose');
const Joi = require('joi');

const assistantSchema = new Schema(
  {
    owner: String,
    tariffPlan: {
      type: String,
      enum: ['start', 'pro', 'max'],
      default: 'start',
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
  tariffPlan: Joi.string().required(),
});

const Assistant = model('assistant', assistantSchema);

module.exports = {
  Assistant,
  createAssistantSchema,
};
