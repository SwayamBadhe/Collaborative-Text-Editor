const router = require('express').Router();
const { SignUp, Login } = require('../Controllers/AuthController');
const { getDocuments } = require('../Controllers/documentController');
const { userVerification } = require('../middleware/AuthMiddleware');

router.post('/signup', SignUp);
router.post('/login', Login);
router.post('/', userVerification);
router.get('/documents', getDocuments);

module.exports = router;
