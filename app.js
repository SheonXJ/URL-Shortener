//Require packages in the project
const express = require('express')
const mongoose = require('mongoose')

//Setting: express
const app = express()
const PORT = 3000

//Setting: database
mongoose.connect('mongodb://localhost/URL-Shortener', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('Mongodb error')
})
db.once('open', () => {
  console.log('Mongodb is connected!')
})

//Routes: index page
app.get('/', (req, res) => {
  res.send('test')
})

//Activate and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})