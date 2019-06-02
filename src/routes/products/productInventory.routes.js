let ProductInventoryModel = require('../../models/inventory.model')
let OwnerModel = require('../../models/owner.model')
let express = require('express')
let router = express.Router()

// Add products to inventory
router.post('/products/:productId/inventory', (req, res) => {
  req.body['product'] = req.params.productId
  req.body['initialAmount'] = req.body.amount
  let model = new ProductInventoryModel(req.body)

  model.save().then((data) => {
    res.send(data)
  }).catch(err => {
    res.status(400).json(err)
  })
})

// List available inventory for product
router.get('/products/:productId/inventory', (req, res) => {
  let sort = '+createdAt'

  if (res.query && res.query.sort) {
    sort = res.query.sort;
  }

  let minValue = req.params.min || 0

  ProductInventoryModel.find({ product: req.params.productId, amount: { $gt: minValue } })
    .populate({ path: 'owner', model: OwnerModel })
    .sort(sort)
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

module.exports = router
