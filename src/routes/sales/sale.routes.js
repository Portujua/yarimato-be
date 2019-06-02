let InventoryModel = require('../../models/inventory.model')
let ProductModel = require('../../models/product.model')
let SaleModel = require('../../models/sale.model')
let express = require('express')
let router = express.Router()

// Create sale
router.post('/sales', (req, res) => {
  // Check for availability
  InventoryModel.find({ product: req.body.product, amount: { $gt: 0 } }).populate({ path: 'product', model: ProductModel }).then((availableInventory) => {
    let totalAvailable = availableInventory.reduce((s, f) => s + f.amount, 0);

    if (totalAvailable < req.body.amount) {
      return res.status(400).json({ message: 'No hay suficiente inventario' })
    }

    let priceNow = null;
    let amount = req.body.amount;

    let promises = []

    // Remove from inventory
    while (req.body.amount > 0) {
      for (const inventory of availableInventory) {
        if (priceNow == null) {
          console.log(inventory)
          priceNow = inventory.product.price;
        }

        if (req.body.amount <= 0) {
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

        promises.push(InventoryModel.findByIdAndUpdate(inventory._id, { amount: newAmount }, { new: true }))
      }

      // Before breaking from while
      if (req.body.amount <= 0) {
        Promise.all(promises).then(() => {
          console.log('huhhhhh')

          // Create sale
          req.body['unitPrice'] = priceNow;
          req.body['amount'] = amount;
          console.log(req.body)
          let sale = new SaleModel(req.body);

          sale.save().then((data) => {
            res.send(data)
          }).catch(err => {
            res.status(400).json(err)
          })
        }).catch(err => {
          res.status(400).json(err)
        })
      }
    }
  })
})

// List sales
router.get('/sales', (req, res) => {
  SaleModel
    .find({})
    .populate({ path: 'product', model: ProductModel })
    .then((data) => {
      res.send(data)
    })
})

module.exports = router
