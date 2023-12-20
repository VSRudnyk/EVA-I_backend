const { Schema, model } = require('mongoose');
const Joi = require('joi');

const waitListSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phoneNumber: {
      type: String,
    },
    socialLink: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const addToWaitListSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .message('Invalid format. Must contain @')
    .required(),
  phoneNumber: Joi.string()
    .pattern(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
      'Phone number is not valid'
    )
    .optional(),
  socialLink: Joi.string().optional(),
});

const WaitList = model('waitlist', waitListSchema);

module.exports = {
  WaitList,
  addToWaitListSchema,
};
