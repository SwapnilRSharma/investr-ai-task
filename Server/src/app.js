const express = require('express')
require('../src/db/mongoose')
const userRouter = require('./routers/user')
const cors = require('cors');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');

const app = express()
const port = process.env.PORT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(userRouter)

app.listen(port, ()=> {
    console.log('Server is running on port: ' + port)
})