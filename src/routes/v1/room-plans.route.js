const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const roomPlanValidation = require('../../validations/room-plan.validation');
const roomPlanController = require('../../controllers/room-plan.controller');

const router = express.Router();

router.route('/').post(auth(), validate(roomPlanValidation.create), roomPlanController.create);

router
  .route('/:roomPlanId')
  .get(auth(), roomPlanController.get)
  .patch(auth(), roomPlanController.update)
  .delete(auth(), roomPlanController.deleteRoomPlan);

module.exports = router;
