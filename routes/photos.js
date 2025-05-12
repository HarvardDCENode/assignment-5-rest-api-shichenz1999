const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer'); 
const prettyBytes = require('pretty-bytes').default;
const photoController = require('../controllers/photoControllers');
const flash = require('connect-flash');
const upload = multer({ storage: photoController.storage, fileFilter: photoController.imageFilter });
const Photo = require('../models/photoModel');
const PhotoService = photoController.PhotoService;
const app = require('../app');
router.use(flash());

//list
router.get('/', (req, res, next) => {
    PhotoService.list()
        .then((photos) => {
            res.render('photos', { 
                title: 'Photos',
                photos : photos 
            });
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

router.get('/upload', (req, res, next) => {
    res.render('uploadPhoto', {
        title: 'Upload Photo',
        flashMsg: req.flash('fileUploadError')
    });
});

//find
router.get('/:photoid', (req, res, next) => {
    PhotoService.find(req.params.photoid)
        .then((photo) => {
            if (!photo) {
              return res.redirect('/photos');
            }
            res.render('photoInfo', { 
                title: photo.title,
                photo : photo,
                flashMsg: req.flash('photoFindError')
            });
        })
        .catch((err) => {
            console.error(err);
            next(err);
            res.redirect('/photos');
        });
});

//create
router.post('/upload', upload.single('image'), (req, res, next) => {
    let path = "/img/" + req.file.filename;
    let photoData = {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        filename: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        size: prettyBytes(req.file.size),
        imageurl: path,
    }
    let photo = new Photo(photoData);
    PhotoService.create(photo)
        .then(() => {
            res.redirect('/photos');
        })
        .catch((err) => {
            err.message = 'PhotoSavedError';
            next(err);
        });
});

//update
router.post('/:photoid/edit', async (req, res, next) => {
    const updatedPhoto = await PhotoService.update(req.params.photoid, req.body);
    res.json({
      title: updatedPhoto.title,
      description: updatedPhoto.description,
      updatedDate: updatedPhoto.updatedDate
    });
  });

//delete
router.post('/:photoid/delete', async (req, res, next) => {
    try {
      const photo = await PhotoService.delete(req.params.photoid);
      res.redirect('/photos');
    } catch (err) {
      console.error(err);
      next(err);
    }
});

//like
router.patch('/:id/like', async (req, res, next) => {
    try {
      const { liked } = req.body;
      const photo = await PhotoService.toggleLike(req.params.id, liked);
      res.json({ likes: photo.likes });
    } catch (err) {
      next(err);
    }
  });

router.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message === 'OnlyImageFilesAllowed') {
        req.flash('fileUploadError', 'Please select an image file with a jpg, jpeg, png, or gif extension.');
        res.redirect('/photos/upload/');
    }else if(err.message === 'PhotoSavedError'){
        req.flash('photoSavedError', 'Photo saved failed!');
        res.redirect('/photos/upload/');
    }else{
        next(err);
    }
});

module.exports = router;