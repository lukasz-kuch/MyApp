const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
})

authorSchema.pre('deleteOne', { document: true, query:false }, function(next) {
  Book.find({ author: this.id })
    .then(books => {
      if (books.length > 0) {
        next(new Error('This author has books still'))
      } else {
        next()
      }
    })
    .catch(err => {
      next(err)
    })

})

module.exports = mongoose.model('Author', authorSchema)
