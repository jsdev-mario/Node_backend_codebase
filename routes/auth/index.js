const express = require('express');
const userCtr = require('../../controllers/user')
const expressValidation = require('express-joi-validation');
const validateSchema = require('./validateSchema');
const validator = expressValidation.createValidator({ passError: true });
const router = express.Router();

router.post('/register', validator.body(validateSchema.register.body), userCtr.register);
router.post('/login', validator.body(validateSchema.login.body), userCtr.login);

module.exports = router