let ProductModel = require('../../models/product.model')
let PriceHistoricModel = require('../../models/priceHistoric.model')
let express = require('express')
let router = express.Router()

// List all products
router.get('/products', (req, res) => {
  let query = {}

  if (req.query.keyword) {
    query = {
      name: {
        $regex: req.query.keyword,
        $options: 'i'
      }
    }
  }

  ProductModel
    .find(query)
    .sort('+name')
    .then((data) => {
      res.send(data)
    })
})

// List price historic by product ID
router.get('/products/:id/price-historic', (req, res) => {
  PriceHistoricModel.find({
    product: req.params.id
  })
    .sort('+createdAt')
    .populate({ path: 'product', model: ProductModel })
    .then((data) => {
      res.send(data)
    })
})

// Get product by ID
router.get('/products/:id', (req, res) => {
  ProductModel.findOne({
    _id: req.params.id
  }).then((data) => {
    res.send(data)
  })
})

// Create product
router.post('/products', (req, res) => {
  let model = new ProductModel(req.body)

  model.save().then((data) => {
    if (!data || data.length === 0) {
      res.status(500).send(data)
    }

    res.send(data)
  }).catch((err) => {
    res.status(500).json(err);
  })
})

// Update product
router.put('/products/:id', (req, res) => {
  if (req.body.price) {
    // Add the changed price
    ProductModel.findById(req.params.id).then((product) => {
      let model = new PriceHistoricModel({
        product: product._id,
        price: req.body.price
      })

      model.save().then((data) => {
        // Nothing here
      })
    })
  }

  ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((data) => {
    res.send(data)
  })
})

module.exports = router
