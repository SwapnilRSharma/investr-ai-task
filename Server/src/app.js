const express = require('express')
const app = express()
require('../src/db/mongoose')

const port = 3000

app.listen(port, ()=> {
    console.log('Server is running on port: ' + port)
})