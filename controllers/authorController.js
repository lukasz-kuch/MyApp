const Author = require('../models/author')
const Book = require('../models/book')

exports.author_list = (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name != '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  Author.find(searchOptions)
    .then(authors => {
      res.render('authors/index', {
        authors: authors,
        searchOptions: req.query
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
}

exports.new_author = (req, res) => {
  res.render('authors/new', { author: new Author() })
}

exports.create_author = (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  author.save()
    .then((newAuthor) => {
      res.redirect(`authors/${newAuthor.id}`)
    })
    .catch(() => {
      res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author'
      })
    })
}


exports.get_author = (req, res) => {
  Author.findById(req.params.id)
    .then(author => {
      Book.find({author: author.id})
        .limit(6)
        .exec()
        .then((books) => {
          res.render('authors/show', {
            author: author,
            booksByAuthor: books
          })
        })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
}

exports.edit_author = (req, res) => {
  Author.findById(req.params.id)
    .then(author => {
      res.render('authors/edit', { author: author })
    })
    .catch(() => {
      res.redirect('/authors')
    })
}

exports.update_author = (req, res) => {
  Author.findById(req.params.id)
    .then(author => {
      author.name = req.body.name
      author.save()
        .then((author) => {
          res.redirect(`/authors/${author.id}`)
        })
        .catch(() => {
          res.render('authors/edit', {
            author: author,
            errorMessage: 'Error updating Author'
          })
        })
    })
    .catch(() => {
      res.redirect('/')
    })
}

exports.delete_author = (req, res) => {
  Author.findById(req.params.id)
  .then(author => {
    author.deleteOne()
      .then(() => {
        res.redirect('/authors')
      })
      .catch((err) => {
        console.log(err)
        res.redirect(`/authors/${author.id}`)
      })
  })
  .catch(() => {
    res.redirect('/')
  })
}
