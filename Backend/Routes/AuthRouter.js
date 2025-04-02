const { signup, login } = require('../Controllers/AuthContoller');
const { singupValidation, loginValidation } = require('../Middleware/authValidation');

const router = require('express').Router();


router.post('/signup', singupValidation, signup);
router.post("/login", loginValidation, login);

module.exports = router;