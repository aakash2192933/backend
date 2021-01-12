const router = require('express').Router();

const jsonPatchController = require('../controllers/jsonPatchController');

router.route('/apply').post(jsonPatchController.applyJsonPatch);

module.exports = router;