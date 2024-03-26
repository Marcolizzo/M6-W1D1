const express = require('express');
const router = express.Router();
const BlogPostsModel = require('../models/blogPosts');
const cloudUpload = require('../cloudConfig');
const AuthorSchema = require('../models/authors')

router.post("/blogPosts/cloudUploadImg", cloudUpload.single('uploadImg'), async (req, res) => {
    try {
        await res.status(200).json({ source: req.file.path })
    } catch (e) {
        res.status(500)
            .send({
                statusCode: 500,
                message: "File upload error",
            });
    }
})

router.get('/blogPosts', async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;

    try {
        const blogPosts = await BlogPostsModel.find()
            .populate('author')
            .limit(pageSize)
            .skip((page - 1) * pageSize)
        res
            .status(200)
            .send(blogPosts);
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.get('/blogPosts/:id', async (req, res) => {
    const id = req.params;

    try {
        const blogPost = await BlogPostsModel.findById(id);

        if (!blogPost) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested blogPost does not exist!'
                })
        }
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.post('/blogPost', async (req, res) => {
    const author = await AuthorSchema.findOne({ _id: req.body.author });
    const newPostBody = { ...req.body, author: author._id }
    const newPost = new BlogPostModel(newPostBody);
    try {
        const postToSave = await newPost.save();
        res.status(201).send({
            statusCode: 201,
            payload: postToSave,
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
        });
    }
});

router.patch('/blogPost/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const post = await BlogPostModel.findById(id);
        if (!post) {
            return res.status(404).send({
                statusCode: 404,
                message: 'The requested post does not exist!'
            })
        }

        const updatedPost = req.body;
        console.log("Updating post with:", req.body);
        const options = { new: true };
        const result = await BlogPostModel.findByIdAndUpdate(id, updatedPost, options);

        res.status(200).send(result);
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
        });
    }
});

router.delete('/deleteBlogPost/:id', async (req, res) => {
    const { id } = req.params
    try {
        const post = await BlogPostsModel.findByIdAndDelete(id);
        if (!post) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested blogPost does not exist!'
                })
        }

        res
            .status(200)
            .send(`Post with id ${id} successfully removed`)
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

module.exports = router;