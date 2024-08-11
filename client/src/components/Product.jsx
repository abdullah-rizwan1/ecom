import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setStatusIdle } from './productSlice'
const Product = ({
    id,
    make,
    model,
    variant,
    generic_image,
    starting_from,
}) => {
    const dispatch = useDispatch()
    const onClickHandler = () => {
        dispatch(setStatusIdle())
    }
    return (
        <div className="no-spec">
            <Link
                to={`${id}`}
                style={{ textDecoration: 'none' }}
                onClick={onClickHandler}>
                <div className="product-no-spec">
                    <img src={generic_image} alt="" className="product-image" />
                    <p>{make}</p>
                    <p>{model}</p>
                    <p>{variant}</p>
                    <p>Starting From: {starting_from}</p>
                </div>
            </Link>
        </div>

        // <Link
        //     to={`${id}`}
        //     style={{ textDecoration: 'none' }}
        //     onClick={onClickHandler}>
        //     <div className="product-container">
        //         <div className="product-wrapper">
        //             <div className="product-image">
        //                 <img
        //                     src={generic_image}
        //                     alt=""
        //                     className="product-image"
        //                 />
        //             </div>
        //             <h5>{make}</h5>
        //             <h5>{model}</h5>
        //             <h5>{variant}</h5>
        //         </div>
        //     </div>
        // </Link>
    )
}

export default Product
