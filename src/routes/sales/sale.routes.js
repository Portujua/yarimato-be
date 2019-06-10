let InventoryModel = require('../../models/inventory.model')
let ProductModel = require('../../models/product.model')
let SaleModel = require('../../models/sale.model')
let OwnerModel = require('../../models/owner.model')
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

    let inventoriesUsed = []
    let promises = []

    // Remove from inventory
    while (req.body.amount > 0) {
      for (const inventory of availableInventory) {
        if (priceNow == null) {
          priceNow = inventory.product.price;
        }

        if (req.body.amount <= 0) {
          break
        }

        let newAmount = 0
        let amountUsed = 0

        if (inventory.amount >= req.body.amount) {
          amountUsed = req.body.amount
          newAmount = inventory.amount - req.body.amount
          req.body.amount = 0
        } else {
          amountUsed = inventory.amount
          newAmount = 0
          req.body.amount -= inventory.amount
        }

        promises.push(InventoryModel.findByIdAndUpdate(inventory._id, { amount: newAmount }, { new: true }).then((data) => {
          inventoriesUsed.push({ amount: amountUsed, inventory: data })
        }))
      }

      // Before breaking from while
      if (req.body.amount <= 0) {
        Promise.all(promises).then(() => {

          // Create sale
          req.body['unitPrice'] = priceNow;
          req.body['amount'] = amount;
          req.body['inventoriesUsed'] = inventoriesUsed
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

// Get sale by ID
router.get('/sales/:id', (req, res) => {
  SaleModel.findOne({
    _id: req.params.id
  })
    .populate({ path: 'product', model: ProductModel })
    .populate({ path: 'inventoriesUsed.inventory.product', model: ProductModel })
    .populate({ path: 'inventoriesUsed.inventory.owner', model: OwnerModel })
    .then((data) => {
      res.send(data)
    }).catch(err => {
      res.status(400).json(err)
    })
})

module.exports = router
