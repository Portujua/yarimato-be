let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.json())

let databaseConfig = require('./database/config')

app.use((req, res, next) => {
  console.log(`[${new Date().toString()}] Called '${req.originalUrl}' with body: ${JSON.stringify(req.body)}`)
  next()
})

// Routes here
let productRoutes = require('./routes/products/products.routes')
app.use(productRoutes)

let productInventoryRoutes = require('./routes/products/productInventory.routes')
app.use(productInventoryRoutes)

let salesRoutes = require('./routes/sales/sale.routes')
app.use(salesRoutes)


app.use(express.static('public'))

// 404 Handler
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/404.html'))
})

// 500 Handler
app.use((req, res, next) => {
  console.error(err.stack)
  res.sendFile(path.join(__dirname, '../public/500.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.info(`Server started on port ${PORT}`))
