const router = require('express').Router();
const { SignUp, Login } = require('../Controllers/AuthController');
const { userVerification } = require('../middleware/AuthMiddleware');

router.post('/signup', SignUp);
router.post('/login', Login);
router.post('/', userVerification);

module.exports = router;
