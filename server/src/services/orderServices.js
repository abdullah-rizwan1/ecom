const ecomDB = require('../config/mysql')

exports.addOrder = async (customer_email, product_id, specs_id) => {
    let addOrderQuery = `
        INSERT INTO 
        Orders(customer_email, product_id, specs_id)
        VALUES (?,?,?)
    `

    let orderAdded = await ecomDB.query(addOrderQuery, [
        customer_email,
        product_id,
        specs_id,
    ])
    return orderAdded[0].affectedRows ? true : null
}
