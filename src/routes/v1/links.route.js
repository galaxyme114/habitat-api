const express = require('express');
const auth = require('../../middlewares/auth');
const linkController = require('../../controllers/link.controller');

const router = express.Router();

// TODO: Add preview validation
router.route('/').post(auth(), linkController.createLinkPreviewForProject);

router
  .route('/:linkId')
  .patch(auth(), linkController.updateLinkPreviewForProject)
  .delete(auth(), linkController.deleteLinkPreviewForProject);

router.route('/preview').post(auth(), linkController.fetchLinkPreviewData);

module.exports = router;
