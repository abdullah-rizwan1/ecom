const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config() 

exports.encryptString = async (str) => {
    const salt = await bcrypt.genSalt(10)
    const encryptedString = await bcrypt.hash(str,salt);
    return encryptedString
}

exports.isValidUser = async(userTypePassword, dbPassword) => {
    let isValidPassword = await bcrypt.compare(userTypePassword, dbPassword)
    return isValidPassword
}   


exports.generateAuthToken = async (data) => {
    const token = jwt.sign(
        {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
        },
        process.env.jwt
    )

    return token
}

exports.addAuthTokenInResponseheader = async (data, resObject) => {
    let token = await this.generateAuthToken(data)
    data.token = token
    resObject.header('authorization-token', token)
    return resObject
}