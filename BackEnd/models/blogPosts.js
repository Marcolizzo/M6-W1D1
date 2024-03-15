const mongoose = require('mongoose')

const blogPostSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        max: 255
    },
    title: {
        type: String,
        required: true,
        max: 255
    },
    cover: {
        type: String,
        required: true,
    },
    readTime: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    },
    author: {
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    },
    content: {
        type: String,
        required: false
    }
}, {timestamps: true, strict: true})

module.exports = mongoose.model('blogPostModel', blogPostSchema, 'blogPosts')