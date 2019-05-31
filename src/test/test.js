let TestModel = require('../models/test.model')
let express = require('express')
let router = express.Router()

router.get('/tests', (req, res) => {
  TestModel.find({}).then((doc) => {
    res.send(doc);
  })
})

router.get('/test', (req, res) => {
  if (!req.query.name) {
    return res.status(500).send('Missing name');
  }

  TestModel.findOne({
    name: req.query.name
  }).then(doc => {
    res.json(doc);
  }).catch(err => {
    res.status(500).json(err)
  })
})

router.post('/test', (req, res) => {
  if (!req.body) {
    return res.status(500).send('Body is missing')
  }

  let model = new TestModel(req.body)
  model.save().then(doc => {
    if (!doc || doc.length === 0) {
      return res.status(500).send(doc)
    }

    res.status(201).send(doc)
  }).catch(err => {
    res.status(500).json(err);
  })
})

module.exports = router
