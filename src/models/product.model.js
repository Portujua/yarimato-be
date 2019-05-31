let mongoose = require('mongoose')

let ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Product', ProductSchema)
