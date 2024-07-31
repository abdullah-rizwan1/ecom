const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const storeController = require('../controllers/storeController')


//GET Routes
router.get('/list', [verifyToken], storeController.getStoresController)
router.get('/:store_name', [verifyToken], storeController.getStoreByName)


// POST Routes
router.post('/create', [verifyToken], storeController.createStoreController)
router.post('/:store_name/change', [verifyToken], storeController.changeStoreName)
module.exports = router