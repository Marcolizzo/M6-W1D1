const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        cover: {
            type: String,
            required: true,
        },
        readTime: {
            value: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                required: true,
            },
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "authorModel",
        },
        content: {
            type: String,
            required: false,
        },
    },
    { timestamps: true, strict: true }
);

module.exports = mongoose.model("blogPostModel", BlogPostSchema, "blogPost");