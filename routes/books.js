const express = require('express')
const router = express.Router()
const book_controller = require('../controllers/bookController')

// All Books Route
router.get('/', book_controller.book_list)

// New Book Route
router.get('/new', book_controller.new_book)

// Create Book Route
// router.post('/', upload.single('cover'), book_controller.create_book)
router.post('/', book_controller.create_book)

router.delete('/delete', book_controller.delete_book)

module.exports = router
