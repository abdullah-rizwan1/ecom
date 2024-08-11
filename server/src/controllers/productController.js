const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const specsServices = require('../services/specsServices')
const storeServices = require('../services/storeServices')
const productServices = require('../services/productServices')
const customerServices = require('../services/customerService')
const orderServices = require('../services/orderServices')
const { SuccessfullResponse } = require('../composer/success-response')
const { ErrorResponse } = require('../composer/error-response')
const AppMessages = require('../constants/appMessages')
const HttpCodes = require('../constants/httpCodes')
const { customerVerificationOTP } = require('../helpers/authHelper')
const nodemailer = require('nodemailer')

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
        let { make, model, variant, generic_image, starting_from } = req.body
        let product = await productServices.addProductToStoreService(
            store_id,
            make,
            model,
            variant,
            generic_image,
            starting_from
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

exports.setProductInactiveController = async (req, res) => {
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

exports.getProductForCustomer = async (req, res) => {
    try {
        let product_id = req.params.product_id
        let product = await productServices.getProductByIdService(product_id)
        let productSpecs = await specsServices.getProductSpecsService(
            product_id
        )

        return SuccessfullResponse(res, AppMessages.SUCCESS, {
            product,
            productSpecs,
        })
    } catch (error) {
        return ErrorResponse(
            res,
            HttpCodes.INTERNAL_SERVER_ERROR,
            AppMessages.INTERNAL_SERVER_ERROR
        )
    }
}

exports.getProductByIdController = async (req, res) => {
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
            let product = await productServices.getProductByIdService(
                req.params.product_id
            )

            let productSpecs = await specsServices.getProductSpecsService(
                req.params.product_id
            )

            if (!product.length) {
                return SuccessfullResponse(res, AppMessages.PRODUCT_NOT_FOUND)
            }

            return SuccessfullResponse(res, AppMessages.SUCCESS, {
                product,
                productSpecs,
            })
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

exports.addProductSpecsController = async (req, res) => {
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
            let product = await productServices.getProductByIdService(
                req.params.product_id
            )

            if (!product.length) {
                return SuccessfullResponse(res, AppMessages.PRODUCT_NOT_FOUND)
            }

            let specsData = [
                req.body.rom,
                req.body.ram,
                req.body.color,
                req.body.image,
                req.body.stock,
                req.body.price,
                req.params.product_id,
            ]

            let specsAdded = await specsServices.addProductSpecsService(
                specsData
            )
            if (!specsAdded) {
                return ErrorResponse(
                    res,
                    HttpCodes.BAD_REQUEST,
                    AppMessages.FAILURE
                )
            }

            return SuccessfullResponse(res, AppMessages.SUCCESS, specsAdded)
            // return SuccessfullResponse(res, AppMessages.SUCCESS, product)
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

exports.getProductByIdForCustomerController = async (req, res) => {
    try {
        let product = await productServices.getProductByIdService(
            req.params.product_id
        )

        if (!product.length) {
            return SuccessfullResponse(res, AppMessages.PRODUCT_NOT_FOUND)
        }

        let productSpecs = await specsServices.getProductSpecsService(
            req.params.product_id
        )

        return SuccessfullResponse(res, AppMessages.SUCCESS, {
            product,
            productSpecs,
        })
    } catch (error) {
        return ErrorResponse(
            res,
            HttpCodes.INTERNAL_SERVER_ERROR,
            AppMessages.INTERNAL_SERVER_ERROR
        )
    }
}

exports.buyProductController = async (req, res) => {
    try {
        let product_id = req.params.product_id
        let specs_id = req.params.specs_id

        let customer_data = [
            req.body.customer_email,
            req.body.customer_name,
            req.body.customer_address,
            req.body.customer_phone,
        ]

        let otp = customerVerificationOTP()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.mail,
                pass: process.env.pass_mail,
            },
        })

        const mailOptions = {
            from: process.env.pass_mail,
            to: customer_data[0],
            subject: 'OTP',
            html: `<h1>OTP For Your Purchase</h1><p>${otp}</p>`,
        }

        await transporter.sendMail(mailOptions)
        //todo: prompt user for OTP confirm match

        let customer = await customerServices.getCustomerByEmail(
            customer_data[0]
        )
        if (!customer) {
            customer = await customerServices.addCustomer(customer_data)
        }

        let orderCreated = await orderServices.addOrder(
            customer_data[0],
            product_id,
            specs_id
        )
        if (!orderCreated) {
            return ErrorResponse(
                res,
                HttpCodes.BAD_REQUEST,
                AppMessages.FAILURE
            )
        }

        return SuccessfullResponse(res, AppMessages.SUCCESS, orderCreated)
    } catch (error) {
        return ErrorResponse(
            res,
            HttpCodes.INTERNAL_SERVER_ERROR,
            AppMessages.INTERNAL_SERVER_ERROR
        )
    }
}
