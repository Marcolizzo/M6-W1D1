const express = require('express');
const router = express.Router();
const BlogPostsModel = require('../models/blogPosts');

router.get('/blogPosts', async (req, res) => {
    try {
        const blogPosts = await BlogPostsModel.find();
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

router.post('/createBlogPost', async (req, res) => {
    const newBlogPost = new BlogPostsModel({
        category: req.body.category,
        title: req.body.title,
        cover: req.body.cover,
        readTime: req.body.readTime,
        author: req.body.author,
        content: req.body.content
    });

    try {
        const blogPostToSave = await newBlogPost.save();
        res
            .status(201)
            .send({
                statusCode: 201,
                payload: blogPostToSave
            })
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.patch('/updateBlogPost/:id', async (req, res) => {
    const { id } = req.params

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

        const updatedBlogPost = req.body;
        const option = { new: true };

        const result = await BlogPostsModel.findByIdAndUpdate(id, updatedBlogPost, option);

        res
            .status(200)
            .send(result)
    } catch (e) {
        res
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.delete('/deleteBlogPost/:id', async (req, res) => {
    const { id } = req.params
    try {
        const blogPost = await BlogPostsModel.findByIdAndDelete(id);
        if (!blogPost) {
            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested blogPost does not exist!'
                })
        }

        res
            .status(200)
            .send(`BlogPost with id ${id} successfully removed`)
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