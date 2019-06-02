let mongoose = require('mongoose')

let OwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Owner', OwnerSchema)
