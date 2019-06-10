let mongoose = require('mongoose')

let ProductInventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  amount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    required: false,
    default: null
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'owner',
    default: null
  },
  initialAmount: {
    type: Number
  },
  price: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('ProductInventory', ProductInventorySchema)
