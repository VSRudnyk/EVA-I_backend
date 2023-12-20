const express = require('express');
const controllerWrapper = require('../helpers/controllerWrapper');
const waitList = require('../controllers/waitList/index');
const router = express.Router();
const { validationMiddleware, adminMiddleware } = require('../middlewares');
const { addToWaitListSchema } = require('../models/waitList.model');

router.get('/:id', adminMiddleware, controllerWrapper(waitList.getWaitList));

router.post(
  '/add',
  validationMiddleware(addToWaitListSchema),
  controllerWrapper(waitList.addToWaitList)
);

module.exports = router;
