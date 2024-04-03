const express = require('express');
const router = express.Router();
//Constroller
const { insertPhoto, 
        deletePhoto, 
        getAllPhotos, 
        getUserPhotos, 
        getPhotoById, 
        updatePhoto, 
        likePhoto,
        commentPhoto,
        searchPhoto } = require('../controllers/PhotoController');
//Middleware
const validate = require('../middlewares/handleValidation');
const authGuard = require('../middlewares/authGuard');
const { imageUpload } = require('../middlewares/imageUpload');
const { photoValidation, photoUpdateValidation, commentValidation } = require('../middlewares/photoValidation');

//Routes
router.get('/list', authGuard, getAllPhotos);
router.post('/store', authGuard, imageUpload.single("image"), photoValidation(), validate, insertPhoto);
router.get('/user/:id', authGuard, getUserPhotos);
router.get('/show/:id', authGuard, getPhotoById);
router.put('/update/:id', authGuard, photoUpdateValidation(), validate, updatePhoto);
router.delete('/delete/:id', authGuard, deletePhoto);
router.put('/like/:id', authGuard, likePhoto);
router.put('/comment/:id', authGuard, commentValidation(), validate, commentPhoto);
router.get('/search', authGuard, searchPhoto);

module.exports = router;