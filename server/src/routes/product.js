const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.get('/products', productController.getProductsController)

module.exports = router
