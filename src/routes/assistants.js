const express = require('express');
const controllerWrapper = require('../helpers/controllerWrapper');
const assistants = require('../controllers/assistants/index');
const authorizeMiddleware = require('../middlewares/authorize.middleware');
const authAssistantMiddleware = require('../middlewares/authAssistant.middleware');
const { createAssistantSchema } = require('../models/assistant.model');

const router = express.Router();
const { validationMiddleware } = require('../middlewares');

router.get('/getJs', assistants.getJs);
router.post('/auth', controllerWrapper(assistants.authAssistant));
router.get(
  '/auth/current',
  authAssistantMiddleware,
  controllerWrapper(assistants.getCurrentAssistant)
);
router.get(
  '/',
  authorizeMiddleware,
  controllerWrapper(assistants.getAssistants)
);
router.get(
  '/:id',
  authorizeMiddleware,
  controllerWrapper(assistants.getAssistant)
);
router.put(
  '/:id',
  authorizeMiddleware,
  controllerWrapper(assistants.updateAssistant)
);
router.delete(
  '/:id',
  authorizeMiddleware,
  controllerWrapper(assistants.deleteAssistant)
);
router.post(
  '/add',
  validationMiddleware(createAssistantSchema),
  authorizeMiddleware,
  controllerWrapper(assistants.createAssistant)
);

module.exports = router;
