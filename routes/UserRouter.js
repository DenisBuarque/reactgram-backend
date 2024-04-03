const express = require('express');
const router = express.Router();
//Constroller
const { register, login, getCurrentUser, upload, getUserById } = require('../controllers/UserController');
//Middleware
const validate = require('../middlewares/handleValidation');
const { userCreateValidation, loginValidation, userUpdateValidation } = require('../middlewares/userValidations');
const authGuard = require('../middlewares/authGuard');
const { imageUpload } = require('../middlewares/imageUpload');

//Routes
router.post('/register', userCreateValidation(), validate, register);
router.put('/upload', userUpdateValidation(), authGuard, validate, imageUpload.single("profileImage"), upload);
router.post('/login', loginValidation(), validate, login);
router.get('/profile', authGuard, getCurrentUser);
router.get('/show/:id', getUserById);

module.exports = router;