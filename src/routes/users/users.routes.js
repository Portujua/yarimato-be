let OwnerModel = require('../../models/owner.model')
let express = require('express')
let router = express.Router()

// List owners
router.get('/users/owners', (req, res) => {
  OwnerModel.find({}).then((data) => {
    res.send(data);
  }).catch(err => {
    res.status(400).json(err)
  })
})

// Create owners
router.post('/users/owners', (req, res) => {
  let model = new OwnerModel(req.body)

  model.save().then((data) => {
    if (!data || data.length === 0) {
      res.status(500).send(data)
    }

    res.send(data)
  }).catch((err) => {
    res.status(500).json(err);
  })
})

module.exports = router
