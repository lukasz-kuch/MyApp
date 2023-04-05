const express = require('express')
const router = express.Router()
const author_controller = require('../controllers/authorController')

// All Authors Route
router.get('/', author_controller.author_list)

// New Author Route
router.get('/new', author_controller.new_author)

// Create Author Route
router.post('/', author_controller.create_author)

module.exports = router
