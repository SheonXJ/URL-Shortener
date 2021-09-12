//Require package in the project
const mongoose = require('mongoose')

//Setting: database
mongoose.connect('mongodb://localhost/URL-Shortener', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('error', () => {
  console.log('Mongodb error')
})
db.once('open', () => {
  console.log('Mongodb is connected!')
})

module.exports = db