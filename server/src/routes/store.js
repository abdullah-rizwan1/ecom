const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const storeController = require('../controllers/storeController')
const productController = require('../controllers/productController')
//GET Routes
router.get('/list', [verifyToken], storeController.getStoresController)
router.get('/:store_name', [verifyToken], storeController.getStoreByName)
router.get(
    '/:store_name/products',
    productController.getProductsByStoreController
)
router.get(
    '/:store_name/:product_id',
    productController.getProductByIdController
)

router.get(
    '/:product_id',
    productController.getProductByIdForCustomerController
)
// POST Routes
router.post('/create', [verifyToken], storeController.createStoreController)

router.post(
    '/:store_name/change',
    [verifyToken],
    storeController.changeStoreName
)
router.post(
    '/:store_name/addProduct',
    productController.addProductToStoreController
)
router.post(
    '/:store_name/:product_id/removeProduct',
    productController.setProductInactiveController
)

router.post(
    '/:store_name/:product_id/addSpecs',
    productController.addProductSpecsController
)

module.exports = router
