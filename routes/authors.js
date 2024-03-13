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

module.exports = router;