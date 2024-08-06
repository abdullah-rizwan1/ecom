const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const storeController = require('../controllers/storeController')
const porductController = require('../controllers/productController')
//GET Routes
router.get('/list', [verifyToken], storeController.getStoresController)
router.get('/:store_name', [verifyToken], storeController.getStoreByName)
router.get(
    '/:store_name/products',
    porductController.getProductsByStoreController
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
    porductController.addProductToStoreController
)
router.post(
    '/:store_name/:product_id/removeProduct',
    porductController.setProductInactive
)

module.exports = router
