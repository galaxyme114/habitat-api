const express = require('express');
const googleController = require('../../controllers/google.controller');

const router = express.Router();

router.route('/images').post(googleController.post);

module.exports = router;
