let ProductInventoryModel = require('../../models/inventory.model')
let express = require('express')
let router = express.Router()

// Add products to inventory
router.post('/products/:productId/inventory', (req, res) => {
  req.body['product'] = req.params.productId
  let model = new ProductInventoryModel(req.body)

  model.save().then((data) => {
    res.send(data)
  })
})

module.exports = router
