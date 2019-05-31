let mongoose = require('mongoose')

const server = 'yarimato-6bsf3.mongodb.net'
const database = 'yarimato'
const user = 'admin'
const password = '974eUnME7WgliHoM'

mongoose.connect(`mongodb+srv://${user}:${password}@${server}/${database}?retryWrites=true&w=majority`)
