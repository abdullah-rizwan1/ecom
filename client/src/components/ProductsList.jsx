import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {
    selectAllProducts,
    getProductsError,
    getProductsStatus,
    fetchProducts,
    fetchProductsForStore,
    setStatusIdle,
} from './productSlice'
import Product from './Product'
import React from 'react'
import '../styles/productList.css'
import useAuth from '../hooks/useAuth'

const ProductsList = () => {
    const dispatch = useDispatch()
    const { auth } = useAuth()
    const products = useSelector(selectAllProducts)
    const productsStatus = useSelector(getProductsStatus)
    const error = useSelector(getProductsError)
    useEffect(() => {
        let url = window.location.href
        console.log('check stats: ', productsStatus)
        if (url.includes('supplier')) {
            let newStr = url.split('').reverse().join('')
            let store = newStr.substring(0, newStr.indexOf('/'))
            store = store.split('').reverse().join('')
            if (productsStatus === 'idle') {
                dispatch(fetchProductsForStore([auth, store]))
            }
        } else {
            if (productsStatus === 'idle') {
                dispatch(fetchProducts())
            }
        }
    }, [productsStatus, dispatch])

    let content
    if (productsStatus === 'loading') {
        content = <p>Fetching products....</p>
    } else if (productsStatus === 'succeeded') {
        content = products.map((product) => (
            <Product
                key={product.product_id}
                id={product.product_id}
                make={product.make}
                model={product.model}
                variant={product.variant}
                generic_image={product.generic_image}
                starting_from={product.starting_from}
            />
        ))
    } else if (productsStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section className="products-section">
            <h1>Products</h1>
            <div className="products-list">{content}</div>
        </section>
    )
}

export default ProductsList
