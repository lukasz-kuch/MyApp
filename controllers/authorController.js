const Author = require('../models/author')

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
      // res.redirect(`authors/${newAuthor.id}`)
      res.redirect('authors')
    })
    .catch(() => {
      res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author'
      })
    })
}
