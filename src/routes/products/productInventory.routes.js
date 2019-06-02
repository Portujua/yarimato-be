let ProductInventoryModel = require('../../models/inventory.model')
let express = require('express')
let router = express.Router()

// Add products to inventory
router.post('/products/:productId/inventory', (req, res) => {
  req.body['product'] = req.params.productId
  let model = new ProductInventoryModel(req.body)

  model.save().then((data) => {
    res.send(data)
  }).catch(err => {
    res.status(400).json(err)
  })
})

// List available inventory for product
router.get('/products/:productId/inventory', (req, res) => {
  let minValue = req.params.min || 0

  ProductInventoryModel.find({ amount: { $gt: minValue } }).then((data) => {
    res.send(data);
  }).catch(err => {
    res.status(400).json(err)
  })
})

module.exports = router
