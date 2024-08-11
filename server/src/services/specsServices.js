const ecomDB = require('../config/mysql')

exports.addProductSpecsService = async (specs) => {
    let addSpecsQuery = `
        INSERT INTO Specs(
            rom, ram, color, image, stock, price,product_id
        )
        VALUES (? , ? , ? , ?, ?, ?, ?)
    `

    let addedSpecs = await ecomDB.query(addSpecsQuery, specs)
    return addedSpecs[0].affectedRows ? true : null
}

exports.getProductSpecsService = async (product_id) => {
    let getProductsSpecsQuery = `
        SELECT * 
        FROM Specs
        WHERE product_id = ?
    `

    let specsForProduct = await ecomDB.query(getProductsSpecsQuery, [
        product_id,
    ])
    return specsForProduct[0] ? specsForProduct[0] : null
}
