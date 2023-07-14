const Book = require('../models/book')
const path = require('path')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Author = require('../models/author')

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
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book, req.body.cover)
  book.save()
    .then((newBook) => {
      res.redirect(`books/${newBook.id}`)
    })
    .catch((err) => {
      console.log(err)
      renderNewPage(res, book, true)
    })
}

exports.get_book = (req, res) => {
  Book.findById(req.params.id)
    .populate('author')
    .exec()
    .then(book => {
      res.render('books/show', { book: book })
    })
    .catch(() => {
      res.redirect('/')
    })
}

exports.edit_book = (req, res) => {
  Book.findById(req.params.id)
    .then(book => {
      renderEditPage(res, book)
    })
    .catch(() => {
      res.redirect('/')
    })
}

exports.update_book =  (req, res) => {
  Book.findById(req.params.id)
    .then(book => {
      book.title = req.body.title
      book.author = req.body.author
      book.publishDate = new Date(req.body.publishDate)
      book.pageCount = req.body.pageCount
      book.description = req.body.description
      if (req.body.cover != null && req.body.cover !== '') {
        saveCover(book, req.body.cover)
      }
      book.save()
        .then((book) => {
          res.redirect(`/books/${book.id}`)
        })
        .catch(() => {
          renderEditPage(res, book, true)
        })
    })
    .catch(() => {
      res.redirect('/')
    })
}

exports.delete_book = (req, res) => {
  Book.findById(req.params.id)
    .then(book => {
      book.deleteOne()
        .then(() => {
          res.redirect('/books')
        })
        .catch(() => {
          res.render('books/show', {
            book: book,
            errorMessage: 'Could not remove book'
          })
        })
    })
    .catch(() => {
      res.redirect('/')
    })
}

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
  Author.find({})
    .then(authors => {
      const params = {
        authors: authors,
        book: book
      }
      if (hasError) {
        if (form == 'edit') {
          params.errorMessage = 'Error updating Book'
        } else {
          params.errorMessage = 'Error creating Book'
        }
      }
      res.render(`books/${form}`, params)
    })
    .catch(() => {
      res.redirect('/books')
    })
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}
