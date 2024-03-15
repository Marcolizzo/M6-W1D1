const express = require('express');
const router = express.Router();
const AuthorsModel = require('../models/authors');

router.get('/authors', async (request, response) => {
    try {
        const authors = await AuthorsModel.find();
        response
            .status(200)
            .send(authors)
    } catch (e) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.get('/authors/:id', async (request, response) => {
    const id = request.params;

    try {
        const author = await AuthorsModel.findById(id);

        if (!author) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested author does not exist!'
                })
        }
    } catch (e) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})


router.post('/createAuthor', async (request, response) => {
    const newAuthor = new AuthorsModel({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        birthday: request.body.birthday,
        avatar: request.body.avatar
    });

    try {
        const authorToSave = await newAuthor.save();
        response
            .status(201)
            .send({
                statusCode: 201,
                payload: authorToSave
            })
    } catch (e) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.patch('/updateAuthor/:id', async (request, response) => {
    const { id } = request.params

    try {
        const author = await AuthorsModel.findById(id);
        if (!author) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested author not exist!'
                })
        }

        const updatedData = request.body;
        const options = { new: true };

        const result = await AuthorsModel.findByIdAndUpdate(id, updatedData, options);

        response
            .status(200)
            .send(result)
    } catch (e) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

router.delete('/deleteAuthor/:id', async (request, response) => {
    const { id } = request.params
    try {
        const author = await AuthorsModel.findByIdAndDelete(id);
        if (!author) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'The requested author not exist!'
                })
        }

        response
            .status(200)
            .send(`User with id ${id} successfully removed`)
    } catch (e) {
        response
            .status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

module.exports = router;