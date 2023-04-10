const express = require('express')
const router = express.Router()
const author_controller = require('../controllers/authorController')

// All Authors Route
router.get('/', author_controller.author_list)

// New Author Route
router.get('/new', author_controller.new_author)

// Create Author Route
router.post('/', author_controller.create_author)

// Get Author Route
router.get('/:id', author_controller.get_author)

// Edit Author Route
router.get('/:id/edit', author_controller.edit_author)

// Update Author Route
router.put('/:id', author_controller.update_author)

// Delete Author Route
router.delete('/:id', author_controller.delete_author)

module.exports = router
