const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    filename: { type: String, required: true },
    title: { type: String, required: false },
    description: { type: String, required: false },
    imageurl: { type: String, required: true },
    size: { type: String, required: true },
    likes: { type: Number, default: 0 },
    createdDate: {type: Date},
    updatedDate: {type: Date}
});

schema.pre('save', function(next) {
    if(!this.createdDate) {
        this.createdDate = Date.now();
        this.updatedDate = Date.now();
    }else {
        this.updatedDate = Date.now();
    }
    next();
});

module.exports = mongoose.model('Photo', schema);