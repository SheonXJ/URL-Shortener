//Require packages in the project
const express = require('express')
const exhbs = require('express-handlebars')
const router = require('./routes') // 引用路由器
require('./config/mongoose')

//Setting: express
const app = express()
const PORT = 3000

//Setting: template engine
app.engine('hbs', exhbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')
//Setting: body-parser
app.use(express.urlencoded({ extended: true}))
//Setting: static files
app.use(express.static('public'))
//Setting: load router
app.use(router)

//Activate and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})