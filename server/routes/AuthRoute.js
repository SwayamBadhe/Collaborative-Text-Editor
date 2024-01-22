const router = require('express').Router();
const { SignUp } = require('../Controllers/AuthController');

router.post('/signup', SignUp);

module.exports = router;
