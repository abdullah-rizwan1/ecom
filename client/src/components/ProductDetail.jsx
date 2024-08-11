import React, { useEffect } from 'react'
import {
    fetchProductDetails,
    getProductsError,
    getProductsStatus,
    selectAllProducts,
    setStatusIdle,
} from './productSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import '../styles/productDetails.css'
const ProductDetail = () => {
    const dispatch = useDispatch()
    const { product_id } = useParams()
    const prodAndSpecs = useSelector(selectAllProducts)
    const status = useSelector(getProductsStatus)
    const error = useSelector(getProductsError)
    let product
    let specs

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProductDetails(product_id))
        }
    }, [status])
    console.log(prodAndSpecs)
    let content

    if (status === 'loading') {
        content = <p>Fetching product data....</p>
    } else if (status === 'succeeded') {
        product = prodAndSpecs.product
        specs = prodAndSpecs.productSpecs
        content = specs.map((spec) => (
            <div className="spec">
                <img
                    src={spec.image}
                    alt="phone image"
                    className="spec-image"
                />
                <p>
                    ROM: {spec.rom} {spec.rom < 10 ? 'TB' : 'GB'}
                </p>
                <p>RAM: {spec.ram}</p>
                <p>COLOR: {spec.color}</p>
                <p>In Stock: {spec.stock}</p>
                <p>Price: {spec.price}</p>
                <p className="spec-button">
                    <Link to="#">Buy Now</Link>
                </p>
            </div>
        ))
    } else if (status === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <div className="product-details-page">
            <h1>Product Detail</h1>
            {product && (
                <h4 style={{ color: 'black' }}>
                    {product[0]['make']} {product[0]['model']}{' '}
                    {product[0]['variant']}
                </h4>
            )}
            <div className="detail-container">{content}</div>
        </div>
    )
}

export default ProductDetail
