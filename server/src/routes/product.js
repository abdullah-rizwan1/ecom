const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

// get requests
router.get('/products', productController.getProductsController)
router.get(
    '/:product_id',
    productController.getProductByIdForCustomerController
)

//post requests
router.post(
    '/:product_id/:specs_id/buy',
    productController.buyProductController
)

module.exports = router
