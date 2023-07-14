const express = require('express')
const router = express.Router()
const book_controller = require('../controllers/bookController')

// All Books Route
router.get('/', book_controller.book_list)

// New Book Route
router.get('/new', book_controller.new_book)

// Create Book Route
router.post('/', book_controller.create_book)

// Get Book Route
router.get('/:id', book_controller.get_book)

// Edit Book Route
router.get('/:id/edit', book_controller.edit_book)

// Update Book Route
router.put('/:id', book_controller.update_book)

// Delete Book Route
router.delete('/:id', book_controller.delete_book)

module.exports = router
