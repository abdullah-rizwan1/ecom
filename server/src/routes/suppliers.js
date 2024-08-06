const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const supplierController = require('../controllers/supplierController')

// GET Routes
router.get('/list', [verifyToken], supplierController.getSuppliersController)
router.get('/:id', [verifyToken], supplierController.getSupplierByIdController)

// POST Routes
router.post('/signup', supplierController.createSupplierController)
router.post('/login', supplierController.login)
router.post('/forgot-password', supplierController.forgotPassword)
router.post('/reset-password/:token', supplierController.resetPassword)

// DELETE Routes
router.delete('/:id', [verifyToken], supplierController.deleteSupplierById)

module.exports = router
