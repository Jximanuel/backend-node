const express = require('express');
const { signUp, loginUser, forgotPassword, resetPassword, deleteUser } = require('../controller/authController');
const router = express.Router();

// Router untuk signup
router.post('/signup', signUp);

// Router untuk login
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)

router.delete('/:id', deleteUser)

module.exports = router;
