const express = require('express');
const mediaController = require('../../controllers/media.controller');
const { upload } = require('../../services/ImageUpload');

const router = express.Router();

router.route('/upload').post(mediaController.uploadImage);

router.route('/user-profile').post(upload.single('file'), mediaController.userProfileImage);

router.route('/dropzone').post(upload.single('file'), mediaController.dropzone);

router.route('/dropzone/new-project').post(upload.single('file'), mediaController.newProjectImage);

router.route('/:imageId').post(mediaController.addTagToImage);

module.exports = router;
