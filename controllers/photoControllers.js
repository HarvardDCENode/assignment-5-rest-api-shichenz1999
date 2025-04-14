const multer = require('multer');
const Photo = require('../models/photoModel');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const imageFilter = function(req, file, cb) {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
    } else {
        cb(new Error('OnlyImageFilesAllowed'), false);
    }
}

class PhotoService {
    //list
    static list() {
        return Photo.find({})
            .then((photos) => {
                return photos;
            })
            .catch((err) => {
                throw err;
            });
    }

    //find
    static find(id) {
        return Photo.findById(id)
            .then((photo) => {
                if (!photo) {
                    throw new Error('PhotoNotFound');
                }
                return photo;
            })
    }

    //create
    static create(photoData) {
        let photo = new Photo(photoData);
        return photo.save()
            .then(() => {
                return photo;
            })
            .catch((err) => {
                throw err;
            });
    }

    //update
    static async update(id, photoData) {
        const photo = await Photo.findById(id);
        if (!photo) {
          throw new Error('PhotoNotFound');
        }
        photo.set(photoData);
        photo.updatedDate = Date.now();
        await photo.save();
        return photo;
    }

    //delete
    static async delete(id) {
        const photo = await Photo.findByIdAndDelete(id);
        if (!photo) {
            throw new Error('PhotoNotFound');
        }
        const imagePath = path.join(process.cwd(), 'public', 'img', photo.filename);
        try {
            await fs.promises.unlink(imagePath);
        } catch (err) {
            console.warn(`Failed to delete file: ${imagePath}`, err.message);
        }
        return photo;
    }
}

module.exports.storage = storage;
module.exports.imageFilter = imageFilter;
module.exports.PhotoService = PhotoService;
