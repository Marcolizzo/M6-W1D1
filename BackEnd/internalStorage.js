// const multer = require('multer');

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