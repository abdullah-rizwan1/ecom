const supplierService = require('../services/supplierService')
const HttpCodes = require('../constants/httpCodes')
const authHelper = require('../helpers/authHelper')
const AppMessages = require('../constants/appMessages')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const { SuccessfullResponse } = require('../composer/success-response')
const { ErrorResponse } = require('../composer/error-response')
dotenv.config()



exports.createSupplierController = async (req,res) => {
    try {  
        let body = req.body
        let exists = await supplierService.getSupplierByEmail(body.email)
        if (exists) {
            return ErrorResponse(res,HttpCodes.BAD_REQUEST, AppMessages.DUPLICATE_RECORD)
        } else {
            const password = await authHelper.encryptString(body.password)
            const supplier = await supplierService.createSupplier(body.first_name, body.last_name, body.email, password )
            return SuccessfullResponse(res,AppMessages.SUCCESS, supplier)
        }

        
    } catch(error) {
        return ErrorResponse(res,HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}


exports.getSuppliersController = async (req,res) => {
    try {
        const suppliers = await supplierService.getSuppliers()
        if (!suppliers) {
            return SuccessfullResponse(res,"No suppliers in supplier list.", suppliers)
        }

        return SuccessfullResponse(res,AppMessages.SUCCESS, supplier)
    } catch(error) {
        return ErrorResponse(res,HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}

exports.getSupplierByIdController = async (req,res) => {
    try {
        let id = req.params['id']
        let supplier = await supplierService.getSupplierById(id)
        if (!supplier) {
            return SuccessfullResponse(res,`No Supplier with id:${id}`, supplier)
        }

        return SuccessfullResponse(res,AppMessages.SUCCESS, supplier)
    } catch(error) {
        return ErrorResponse(res,HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}

exports.deleteSupplierById = async (req, res) => {
    try {
        let id = req.params['id']
        let supplier = await supplierService.deleteSupplierById(id)
        if (!supplier) {
            return SuccessfullResponse(res,`No Supplier with id:${id}`, supplier)
        }

        return SuccessfullResponse(res,AppMessages.DELETED, supplier)
    } catch (error) {
        return ErrorResponse(res,HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}

exports.login = async (req,res) => {
    try {
        let body = req.body
        let supplier = await supplierService.getSupplierByEmail(body.email)
        if (!supplier) {
            return ErrorResponse(res,HttpCodes.BAD_REQUEST, AppMessages.INVALID_USERNAME_EMAIL)
        }


        const isUserValid = await authHelper.isValidUser(body.password, supplier.password)

        if (!isUserValid) {

            return ErrorResponse(res,HttpCodes.BAD_REQUEST, AppMessages.ACCESS_DENIED)
        }
        
        
        res = await authHelper.addAuthTokenInResponseheader(supplier, res)
        return SuccessfullResponse(res,AppMessages.SUCCESS)
    } catch(error) {
        return ErrorResponse(res,HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}


exports.forgotPassword = async(req,res) => {
    try {
        let { email } = req.body
        let supplier = await supplierService.getSupplierByEmail(email)
        if (!supplier) {
            return SuccessfullResponse(res,`No Supplier with id:${id}`, supplier)
        }

        let token = await authHelper.generateAuthToken(supplier)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.mail,
                pass: process.env.pass_mail
            }
        })


        const mailOptions = {
            from: process.env.mail,
            to: email,
            subject: "Password Reset",
            html: `<h1>Reset Your Password</h1>
                    <p>Click on the following link to reset your password:</p>
                    <a href="http://localhost:5000/api/supplier/reset-password/${token}">http://localhost:5000/api/supplier/reset-password/${token}</a>
                    <p>The link will expire in 10 minutes.</p>
                    <p>If you didn't request a password reset, please ignore this email.</p>`,
        }
        
        await transporter.sendMail(mailOptions)
        return SuccessfullResponse(res,AppMessages.EMAIL_SENT)
    } catch(error) {
        return ErrorResponse(res,HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}

exports.resetPassword = async (req,res) => {
    try {
        let { password } = req.body
        const decodedToken = jwt.verify(req.params.token, process.env.jwt)
        if (!decodedToken) {
            return ErrorResponse(res,HttpCodes.UNAUTHORIZED, AppMessages.INVALID_TOKEN)
        }
        
        const hashedPassword = await authHelper.encryptString(password)
        const supplier = await supplierService.updateSupplierPasswordByEmail(decodedToken.email, hashedPassword)
        return SuccessfullResponse(res,AppMessages.PASSWORD_UPDATED)
    } catch(error) {
        return ErrorResponse(res,HttpCodes.INTERNAL_SERVER_ERROR, AppMessages.INTERNAL_SERVER_ERROR)
    }
}