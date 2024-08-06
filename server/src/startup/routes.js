const express = require('express')
const cors = require('cors')
const supplier = require('../routes/suppliers')
const store = require('../routes/store')
const product = require('../routes/product')
module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        )
        res.header('Access-Control-Expose-Headers', 'authorization-token')
        next()
    })
    app.use(cors())
    app.use(express.json())

    app.use('/api/supplier', supplier)
    app.use('/api/supplier/store', store)
    app.use('/api', product)
}
