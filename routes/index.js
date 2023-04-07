const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', (req, res) => {

  Book.find()
    .sort({
      createdAt: 'desc'
    })
    .limit(10)
    .exec()
    .then((books) => {
      res.render('index', {books: books})
    })
    .catch(() => {
      res.render('index', {books: []})
    })
})

module.exports = router
