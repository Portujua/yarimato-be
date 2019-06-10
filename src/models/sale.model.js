let mongoose = require('mongoose')

let SaleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  unitPrice: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  inventoriesUsed: {
    type: Array,
    required: true
  }
})

module.exports = mongoose.model('Sale', SaleSchema)
