const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { authenticate } = require('../middleware/auth'); // Assuming you have an authentication middleware

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile/update', authenticate, userController.updateUserProfile);
module.exports = router;