require('./database/config')

let express = require('express')
let cors = require('cors')
let path = require('path')
let bodyParser = require('body-parser')
let mung = require('express-mung')

let app = express()

app.use(bodyParser.json())
app.use(cors())

app.use(mung.json((body, req, res) => {
  return { data: body, status: res.statusCode, message: res.statusMessage }
}))

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Service '${req.originalUrl}' called with body:\n ${JSON.stringify(req.body)}`)

  next()
})

// Routes here
app.use(require('./routes/products/products.routes'))
app.use(require('./routes/products/productInventory.routes'))
app.use(require('./routes/sales/sale.routes'))


app.use(express.static('public'))

// 404 Handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'))
})

// 500 Handler
app.use((req, res, next) => {
  console.error(err.stack)
  res.status(500).sendFile(path.join(__dirname, '../public/500.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.info(`Server started on port ${PORT}`))
