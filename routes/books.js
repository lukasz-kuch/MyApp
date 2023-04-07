const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const Book = require('../models/book')
const uploadPath = path.join('public', Book.coverImageBasePath)
const book_controller = require('../controllers/bookController')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  filter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Books Route
router.get('/', book_controller.book_list)

// New Book Route
router.get('/new', book_controller.new_book)

// Create Book Route
router.post('/', upload.single('cover'), book_controller.create_book)

router.delete('/delete', book_controller.delete_book)

module.exports = router
