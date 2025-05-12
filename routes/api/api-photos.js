const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const prettyBytes = require('pretty-bytes').default;
const photoController = require('../../controllers/photoControllers');
const PhotoService = photoController.PhotoService;
const upload = multer({ 
    storage: photoController.storage, 
    fileFilter: photoController.imageFilter 
});

//photos - list
router.get('/', (req, res, next) => {
    PhotoService.list()
        .then((photos) => {
            console.log(`API Found images: ${JSON.stringify(photos)}`); 
            res.status(200).json(photos);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

// photos/:photoid - find
router.get('/:photoid', (req, res, next) => {
    PhotoService.find(req.params.photoid)
        .then((photo) => {
            console.log(`API Found images: ${JSON.stringify(photo)}`); 
            res.status(200).json(photo);
        })
        .catch((err) => {
            res.status(404);
            res.end();
        });
});

// photos/upload POST - create
router.post('/upload', upload.single('image'), async (req, res, next) => {
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

    try{
        let photo = await PhotoService.create(photoData);
        console.log(`API Created image: ${JSON.stringify(photo)}`); 
        res.status(201).json(photo);
    }catch(err){
        console.error(err);
        next(err);
    }
});

// photos/:photoid PUT - update
router.put('/:photoid', async (req, res, next) => {
    try{
        let photo = await PhotoService.update(req.params.photoid, req.body);
        console.log(`API Updated image: ${JSON.stringify(photo)}`); 
        res.status(200).json(photo);
    }catch(err){
        console.error(err);
        res.status(404);
        res.end();
    }
});

// photos/:photoid DELETE - delete
router.delete('/:photoid', async (req, res, next) => {
    try{
        let photo = await PhotoService.delete(req.params.photoid);
        console.log(`API Deleted image: ${JSON.stringify(photo)}`); 
        res.status(200).json(photo);
    }catch(err){
        console.error(err);
        res.status(404);
        res.end();
    }
});

// photos/:photoid/like PATCH - toggle like/unlike
router.patch('/:photoid/like', async (req, res, next) => {
    try {
        const { liked } = req.body;
        const photo = await PhotoService.toggleLike(req.params.photoid, liked);
        res.json({ likes: photo.likes });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;