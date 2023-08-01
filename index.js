const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const port = process.env.SERVER_PORT 

app.use(express.json()) // stringify me change karnay k liye ye karyngy json ko
app .use('/api', require('./api/users/Router'))
app.use('/api', require('./api/Category/Router') )

// mongoose.connect(process.env.MONGO_URL)
// .then(()=> console.log("DB Connected"))
// .catch((error)=> console.log("SOmething went wrong"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})