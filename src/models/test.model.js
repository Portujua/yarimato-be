let mongoose = require('mongoose')

let TestSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('Test', TestSchema)
