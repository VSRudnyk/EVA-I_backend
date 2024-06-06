const { Schema, model } = require('mongoose');
const Joi = require('joi');

const assistantSchema = new Schema(
  {
    owner: String,
    token: String,
    tariffPlan: {
      type: String,
      enum: ['start', 'pro', 'max'],
      default: 'start',
    },
    questionAnswer: {
      question: [String],
      answer: [String],
    },
    tags: [String],
    address: [String],
    hiBye: {
      salutation: {
        type: [String],
        default: [
          'Як я можу вам допомогти?',
          'Ласкаво просимо до нашого магазину.',
          'Вітаємо нового клієнта!',
          'Що нового сьогодні?',
          'Як справи?',
          'Готовий вам допомогти.',
          'Як пройшов день?',
          'Як я можу вам допомогти сьогодні?',
          'Як себе почуваєте?',
          'Ласкаво просимо до нашої спільноти.',
        ],
      },
      farewell: {
        type: [String],
        default: [
          'До зустрічі!',
          'Поки!',
          'До побачення!',
          'До скорої зустрічі!',
          'Всього найкращого!',
          'Бажаю гарного дня!',
          'Щасливо!',
          'До наступного разу!',
          'Майте чудовий день!',
          'Всього доброго!',
        ],
      },
    },
    defaultSalutation: {
      type: [String],
      default: [
        'Раді вітати Вас на нашому сайті. Що вас цікавить? Якщо виникли запитання, пишіть нам у чат. Ми завжди готові допомогти!',
      ],
    },
    pricefinder: { type: [String], default: ['ціна', 'вартість', 'купити'] },
    priceList: [
      {
        id: String,
        price: String,
        description: String,
        name: String,
      },
    ],
    settings: {
      functionality: {
        ai_disabled: {
          type: Boolean,
          default: true,
        },
        knowledge_enabled: {
          type: Boolean,
          default: true,
        },
        chat_history_enabled: {
          type: Boolean,
          default: true,
        },
        last_messages: {
          type: Number,
          default: 6,
        },
        chat_personality: {
          type: String,
          default: 'You are personal assistant',
        },
        price_lists_enabled: {
          type: Boolean,
          default: true,
        },
        voice: {
          type: Boolean,
          default: false,
        },
        lang: {
          type: String,
          default: 'ua',
        },
      },
      answers: {
        max_response_length: {
          type: Number,
          default: 7,
        },
        max_product_show: {
          type: Number,
          default: 4,
        },
        temperature_of_answers: {
          type: Number,
          default: 1,
        },
        max_responses: {
          type: Number,
          default: 20,
        },
      },
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
