const ecomDB = require('../config/mysql')

exports.getProductsService = async () => {
    let getProductsQuery = `
        SELECT *
        FROM Product
    `

    const products = await ecomDB.query(getProductsQuery)
    return products[0] ? products[0] : null
}

exports.getProductsByStoreService = async (store_id) => {
    let getProductsByStoreQuery = `
        SELECT *
        FROM Product 
        WHERE store_id = ?
    `
    const products = await ecomDB.query(getProductsByStoreQuery, [store_id])
    return products[0] ? products[0] : null
}

exports.getProductByIdService = async (product_id) => {
    let getProductByIdQuery = `
        SELECT * 
        FROM Product
        WHERE product_id = ?
    `

    const product = await ecomDB.query(getProductByIdQuery, [product_id])
    return product[0] ? product[0] : null
}

exports.addProductToStoreService = async (
    store_id,
    make,
    model,
    variant,
    generic_image,
    starting_from
) => {
    let addProductsToStoreQuery = `
        INSERT INTO Product(make, model, variant, generic_image, is_active, store_id, starting_from)
        VALUES (?, ?, ?, ? ,1, ?, ?)
    `

    const product = await ecomDB.query(addProductsToStoreQuery, [
        make,
        model,
        variant,
        generic_image,
        store_id,
        starting_from,
    ])

    return product[0].affectedRows ? true : null
}

exports.setProductInactiveServices = async (product_id) => {
    let setProductInactiveQuery = `
        Update Product
        SET is_active=0
        WHERE product_id = ?
    `

    const updatedProduct = await ecomDB.query(setProductInactiveQuery, [
        product_id,
    ])

    return updatedProduct[0].affectedRows ? true : null
}
