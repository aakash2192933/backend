const router = require('express').Router();

const userController = require('../controllers/userController');

router.route('/authenticate').post(userController.authenticate);
router.route('/validateToken').post(userController.validateToken);
router.route('/addAddress').post(userController.addAddress);

module.exports = router;