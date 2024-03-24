const express = require('express');
const router = express.Router();
const AuthorsModel = require('../models/authors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// INTERNAL STORAGE
// const internalStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         const fileExtension = file.originalname.split('.')
//         cb(null, `${file.fieldname}+${new Date().toISOString()}.${fileExtension}`)
//     }
// })

// const upload = multer({storage: internalStorage})

// router.post('/authors/:id/avatar', upload.single('uploadAvatar'), async (req, res) => {
//     const url = req.protocol + '://' + req.get('host');
//     try {
//         const imageUrl = req.file.filename
//         res.status(200).json({img: `${url}/uploads${imageUrl}`})
//     } catch (e) {
//         res.status(500)
//             .send({
//                 statusCode: 500,
//                 message: 'Internal server error'
//             })
//     }
// })

// CLOUD STORAGE
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Avatars',
        format: async (req, file) => 'png',
        publich_id: (req, file) => file.name
    }
})

const cloudUpload = multer({storage: cloudStorage});

router.post('/authors/:id/avatar', cloudUpload.single('uploadAvatar'), async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    try {
        res.status(200).json({source: req.file.path})
    } catch (e) {
        res.status(500)
            .send({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
})

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