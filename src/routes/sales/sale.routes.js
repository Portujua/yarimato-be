let InventoryModel = require('../../models/inventory.model')
let ProductModel = require('../../models/product.model')
let express = require('express')
let router = express.Router()

// Create sale
router.post('/sales', (req, res) => {
  // Check for availability
  InventoryModel.find({ product: req.body.product, amount: { $gt: 0 } }).then((availableInventory) => {
    let totalAvailable = availableInventory.reduce((s, f) => s + f.amount, 0);

    if (totalAvailable < req.body.amount) {
      return res.status(400).json('No hay suficiente inventario')
    }

    // Remove from inventory
    while (req.body.amount > 0) {
      for (const inventory of availableInventory) {
        if (req.body.amount < 0) {
          break
        }

        let newAmount = 0

        if (inventory.amount >= req.body.amount) {
          newAmount = inventory.amount - req.body.amount
          req.body.amount = 0
        } else {
          newAmount = req.body.amount - inventory.amount
          req.body.amount -= inventory.amount
        }

        InventoryModel.findByIdAndUpdate(inventory._id, { amount: newAmount }, { new: true }).then((data) => {
          console.info(`Inventory ${data._id} was updated to new amount: ${data.amount}`)
        })
      }
    }

    res.send('Sale created successfully')
  }).catch(err => {
    res.status(400).json(err)
  })
})

module.exports = router
