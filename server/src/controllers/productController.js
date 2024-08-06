const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const storeServices = require('../services/storeServices')
const productServices = require('../services/productServices')
const { SuccessfullResponse } = require('../composer/success-response')
const { ErrorResponse } = require('../composer/error-response')
const AppMessages = require('../constants/appMessages')
const HttpCodes = require('../constants/httpCodes')

dotenv.config()

exports.getProductsController = async (req, res) => {
    try {
        let products = await productServices.getProductsService()
        if (!products) {
            return SuccessfullResponse(res, `No products exist`)
        }
        return SuccessfullResponse(res, AppMessages.SUCCESS, products)
    } catch (error) {
        return ErrorResponse(
            res,
            HttpCodes.INTERNAL_SERVER_ERROR,
            AppMessages.INTERNAL_SERVER_ERROR
        )
    }
}

exports.getProductsByStoreController = async (req, res) => {
    try {
        let decodedToken = jwt.verify(
            req.header('authorization-token'),
            process.env.jwt
        )

        let store = await storeServices.getStoreByName(req.params.store_name)
        if (!store) {
            return ErrorResponse(
                res,
                HttpCodes.BAD_REQUEST,
                AppMessages.STORE_NOT_FOUND
            )
        }

        if (store.supplier_id === decodedToken.id) {
            let products = await productServices.getProductsByStoreService(
                store.store_id
            )

            if (!products) {
                return ErrorResponse(
                    res,
                    HttpCodes.SUCCESS,
                    AppMessages.EMPTY_PRODUCTS
                )
            }

            return SuccessfullResponse(res, AppMessages.SUCCESS, products)
        } else {
            return ErrorResponse(
                res,
                HttpCodes.UNAUTHORIZED,
                AppMessages.ACCESS_DENIED
            )
        }
    } catch (error) {
        return ErrorResponse(
            res,
            HttpCodes.INTERNAL_SERVER_ERROR,
            AppMessages.INTERNAL_SERVER_ERROR
        )
    }
}

exports.addProductToStoreController = async (req, res) => {
    try {
        let decodedToken = jwt.verify(
            req.header('authorization-token'),
            process.env.jwt
        )

        let store = await storeServices.getStoreByName(req.params.store_name)
        if (!store) {
            return SuccessfullResponse(
                res,
                `No stores for supplier: ${decodedToken.id}`
            )
        }

        let store_id = store.store_id
        let { make, model, variant } = req.body
        let product = await productServices.addProductToStoreService(
            store_id,
            make,
            model,
            variant
        )

        if (!product) {
            return ErrorResponse(
                res,
                HttpCodes.BAD_REQUEST,
                AppMessages.PRODUCT_NOT_ADDED
            )
        }

        return SuccessfullResponse(res, AppMessages.SUCCESS, product)
    } catch (error) {
        return ErrorResponse(
            res,
            HttpCodes.INTERNAL_SERVER_ERROR,
            AppMessages.INTERNAL_SERVER_ERROR
        )
    }
}

exports.setProductInactive = async (req, res) => {
    try {
        let decodedToken = jwt.verify(
            req.header('authorization-token'),
            process.env.jwt
        )

        let store = await storeServices.getStoreByName(req.params.store_name)

        if (!store) {
            return ErrorResponse(
                res,
                HttpCodes.BAD_REQUEST,
                AppMessages.STORE_NOT_FOUND
            )
        }

        if (store.supplier_id === decodedToken.id) {
            let updatedProduct =
                await productServices.setProductInactiveServices(
                    req.params.product_id
                )

            if (!updatedProduct) {
                return ErrorResponse(
                    res,
                    HttpCodes.NOT_FOUND,
                    AppMessages.PRODUCT_NOT_FOUND
                )
            }

            return SuccessfullResponse(res, AppMessages.SUCCESS)
        } else {
            return ErrorResponse(
                res,
                HttpCodes.UNAUTHORIZED,
                AppMessages.ACCESS_DENIED
            )
        }
    } catch (error) {
        return ErrorResponse(
            res,
            HttpCodes.INTERNAL_SERVER_ERROR,
            AppMessages.INTERNAL_SERVER_ERROR
        )
    }
}

// controller and service functionality will be added after considering specs table
// exports.changeProductAvailabilityInStoreController = async (req, res) => {}
