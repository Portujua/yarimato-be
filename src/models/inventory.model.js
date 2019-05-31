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
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    required: false,
    default: null
  }
})

ProductInventorySchema.methods.countByProduct = function (cb) {
  return this.model('ProductInventory')
    .find({ product: this.product })
    .aggregate({
      $group: {
        _id: '$region',
        count: { $sum: 1 }
      }
    })
}

module.exports = mongoose.model('ProductInventory', ProductInventorySchema)
