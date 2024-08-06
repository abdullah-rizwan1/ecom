const jwt = require('jsonwebtoken')
const HttpCodes = require('../constants/httpCodes')
const { ErrorResponse } = require('../composer/error-response')
const AppMessages = require('../constants/appMessages')
const dotenv = require('dotenv')

dotenv.config()
function verifyToken(req, res, next) {
  const token = req.header('authorization-token')
  if (!token) {
    return ErrorResponse(res, HttpCodes.UNAUTHORIZED, AppMessages.ACCESS_DENIED)
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt)
    req.email = decoded.email
    next()
  } catch (error) {
    return ErrorResponse(res, HttpCodes.UNAUTHORIZED, AppMessages.INVALID_TOKEN)
  }
}

module.exports = verifyToken
