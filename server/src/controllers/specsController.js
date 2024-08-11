const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const storeServices = require('../services/storeServices')
const productServices = require('../services/productServices')
const { SuccessfullResponse } = require('../composer/success-response')
const { ErrorResponse } = require('../composer/error-response')
const AppMessages = require('../constants/appMessages')
const HttpCodes = require('../constants/httpCodes')

dotenv.config()

exports.setSpecsController = async (req, res) => {
    try {
        let decodedToken = jwt.verify(
            req.header('authorization-token'),
            process.env.jwt
        )
    } catch (error) {}
}
