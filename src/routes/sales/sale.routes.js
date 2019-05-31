let InventoryModel = require('../../models/inventory.model')
let ProductModel = require('../../models/product.model')
let express = require('express')
let router = express.Router()

// Create sale
router.post('/sales', (req, res) => {
  // Check for availability
  // let check = new InventoryModel({ product: '5cf04d0491afd7772863d4e1' })
  // check.countByProduct().then((response) => {
  //   res.send(response)
  // })
  // InventoryModel.countDocuments({ product: '5cf04d0491afd7772863d4e1' }, (data) => {
  //   console.log(data)
  //   res.send(data)
  // })

  console.log(db)

  InventoryModel.find({ product: '5cf04d0491afd7772863d4e1' }).populate({ path: 'product', model: 'Product' }).then((data) => {
    res.send(data)
  })
  // InventoryModel.countByProduct('5cf04d0491afd7772863d4e1').then((data) => {
  //   res.send(data)
  // })
})

module.exports = router
