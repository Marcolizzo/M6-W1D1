const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        max: 255
    },
    email: {
        type: String,
        required: true,
    },
    birthday: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    }
}, {timestamps: true, strict: true})

module.exports = mongoose.model('authorModel', AuthorSchema, 'authors')