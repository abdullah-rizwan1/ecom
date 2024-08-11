const express = require('express')
const dotenv = require('dotenv')
const {
    getSuppliersController,
} = require('./src/controllers/supplierController')
const app = express()

dotenv.config()
require('./src/startup/routes')(app)

app.get('/', (req, res) => {
    res.status(200).send('OK\n')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening at ${PORT}`))
