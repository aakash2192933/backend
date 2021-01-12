const router = require('express').Router();

const imageOperationsController = require('../controllers/imageOperationsController');

router.route('/resize').post(imageOperationsController.resizeImage);

module.exports = router;