const ecomDB = require('../config/mysql')

exports.getStores = async (supplier_id) => {
    let getStoresQuery = `
                        SELECT *
                        FROM Store 
                        INNER JOIN Supplier 
                        ON Store.supplier_id = Supplier.supplier_id 
                        WHERE Supplier.supplier_id = ? AND Supplier.is_active=1`

    const stores = await ecomDB.query(getStoresQuery, [supplier_id])
    return stores[0] ? stores[0] : null
}

exports.getStoreByName = async (store_name) => {
    let getStoreByNameQuery = `
                        SELECT *
                        FROM Store
                        WHERE store_name = ?
    `

    const store = await ecomDB.query(getStoreByNameQuery, [store_name])
    return store[0][0] ? store[0][0] : null
}

exports.createStore = async (store_name, store_logo, supplier_id) => {
    let createStoreQuery = `
                            INSERT INTO Store(store_name, store_logo, supplier_id) 
                            VALUES (?,?, ?)`
    const createdStore = await ecomDB.query(createStoreQuery, [
        store_name,
        store_logo,
        supplier_id,
    ])
    return createdStore[0][0] ? createdStore[0][0] : null
}

exports.changeStoreName = async (new_store_name, old_store_name) => {
    let changeStoreNameQuery = `
                                UPDATE Store 
                                SET store_name = ?
                                WHERE store_name = ?
    `

    const nameChanged = await ecomDB.query(changeStoreNameQuery, [
        new_store_name,
        old_store_name,
    ])
    return nameChanged[0].affectedRows
}
