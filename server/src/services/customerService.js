const ecomDB = require('../config/mysql')

exports.addCustomer = async (customer_data) => {
    let addCustomerQuery = `
        INSERT INTO Customer VALUES(?,?,?,?)
    `
    let customerAdded = await ecomDB.query(addCustomerQuery, customer_data)
    return customerAdded[0].affectedRows ? true : null
}

exports.getCustomerByEmail = async (customer_email) => {
    let getCustomerQuery = `
        Select * 
        FROM Customer
        WHERE customer_email = ?
    `

    let customer = await ecomDB.query(getCustomerQuery, [customer_email])

    return customer[0][0] ? customer[0][0] : null
}
