const router = require("express").Router();
const authController = require('../controllers/auth-controllers');


// Initializing the routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);



module.exports = router;