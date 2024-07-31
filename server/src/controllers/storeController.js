const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const storeService = require('../services/storeServices')
const { SuccessfullResponse } = require('../composer/success-response')
const { ErrorResponse } = require('../composer/error-response')
const AppMessages = require('../constants/appMessages')
const HttpCodes = require('../constants/httpCodes')
dotenv.config()


exports.getStoresController = async (req,res) => {
    try {
        let decodedToken = jwt.verify(req.header('authorization-token'), process.env.jwt)
        const stores = await storeService.getStores(decodedToken.id)
        if (!stores) {
            return SuccessfullResponse(res, `No stores for supplier: ${decodedToken.id}`)
        }

        return SuccessfullResponse(res, AppMessages.SUCCESS, stores)
    } catch (error) {
        return ErrorResponse(res, HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}

exports.createStoreController =  async (req,res) => {
    try {
        let decodedToken = jwt.verify(req.header('authorization-token'), process.env.jwt)
        let exists = await storeService.getStoreByName(req.body.store_name)
        
        if (exists) {
            return SuccessfullResponse(res, AppMessages.DUPLICATE_RECORD, exists)
        }
        
        const store = await storeService.createStore(req.body.store_name, decodedToken.id)
        return SuccessfullResponse(res, AppMessages.SUCCESS, store)
    } catch(error) {
        return ErrorResponse(res, HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}


exports.getStoreByName = async (req,res) => {
    try {
        let store = await storeService.getStoreByName(req.params.store_name)
        if (!store) {
            return SuccessfullResponse(res, `Store: ${req.params.store_name}, does not exist.`)
        }
        return SuccessfullResponse(res, AppMessages.SUCCESS, store)
    } catch(error) {
        return ErrorResponse(res, HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}

exports.changeStoreName = async (req,res) => {
    try {
        let store = await storeService.changeStoreName(req.body.store_name, req.params.store_name)
        console.log(store)
        if (!store) {
            return SuccessfullResponse(res, `Store: ${req.params.store_name} does not exist. `)
        }

        return SuccessfullResponse(res, `Store name changed to: ${req.body.store_name}`)
    } catch(error) {
        return ErrorResponse(res, HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}
