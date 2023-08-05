const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const port = process.env.SERVER_PORT 

const cors = require('cors')



app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5800"],
  credentials: true
}));
app.use(express.json()) // stringify me change karnay k liye ye karyngy json ko
app .use('/api', require('./api/users/Router'))
app.use('/api', require('./api/Category/Router') )
app.use('/api', require('./api/Brands/Router') )
app.use('/api', require('./api/products/Router') )

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})