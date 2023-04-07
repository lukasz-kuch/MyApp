const Book = require('../models/book')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const Author = require('../models/author')
const fs = require('fs')

exports.book_list = (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }

  query.exec()
    .then(books => {
      res.render('books/index', {
        books: books,
        searchOptions: req.query
      })
    })
    .catch(() => {
      res.redirect('/books')
    })
}

exports.new_book = (req, res) => {
  renderNewPage(res, new Book())
}

exports.create_book = (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description
  })
  book.save()
    .then(() => {
      // res.redirect(`books/${newBook.id}`)
      res.redirect('books')
    })
    .catch((err) => {
      if (book.coverImageName != null) {
        removeBookCover(book.coverImageName)
      }
      renderNewPage(res, book, true)
    })
}

exports.delete_book = (req, res) => {
  Book.findOneAndDelete({})
    .then(() => {
      res.send("deleted")
    })
}

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.log(err)
  })
}

async function renderNewPage(res, book, hasError = false) {
  Author.find({})
    .then(authors => {
      const params = {
        authors: authors,
        book: book
      }
      if (hasError) params.errorMessage = 'Error creating Book'
      res.render('books/new', params)
    })
    .catch(() => {
      res.redirect('/books')
    })
}

