const express = require('express');
const controllerWrapper = require('../helpers/controllerWrapper');
const assistants = require('../controllers/assistants/index');
const authorizeMiddleware = require('../middlewares/authorize.middleware');
// const authAssistantMiddleware = require('../middlewares/authAssistant.middleware');
const {
  createAssistantSchema,
  updateAssistantSchema,
} = require('../models/assistant.model');

const router = express.Router();
const { validationMiddleware } = require('../middlewares');

router.get('/getJs', assistants.getJs);
// router.post('/auth', controllerWrapper(assistants.authAssistant));
// router.post(
//   '/auth-user',
//   authAssistantMiddleware,
//   controllerWrapper(assistants.authUser)
// );
// router.get(
//   '/auth/current',
//   authAssistantMiddleware,
//   controllerWrapper(assistants.getCurrentAssistant)
// );
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
  validationMiddleware(updateAssistantSchema),
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
