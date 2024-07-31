const express = require('express')
const cors = require('cors')
const supplier = require('../routes/suppliers')
const store = require('../routes/store')
module.exports = (app) => {
    app.use(cors())
    app.use(express.json())


    app.use('/api/supplier', supplier)
    app.use('/api/supplier/store', store)

}