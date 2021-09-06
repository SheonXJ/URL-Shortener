//Require packages in the project
const express = require('express')

//Setting express
const app = express()
const PORT = 3000

//Routes: index page
app.get('/', (req, res) => {
  res.send('test')
})

//Activate and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})