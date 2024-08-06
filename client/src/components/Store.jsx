import { Link } from 'react-router-dom'
const Store = ({ store_name, store_logo }) => {
    return (
        <div class="store-container" style={{ marginLeft: '16px' }}>
            <div class="store-wrapper">
                <div class="banner-image">
                    <img
                        src={store_logo}
                        alt="store logo"
                        height="150px"
                        width="150px"
                    />
                </div>
                <h4>{store_name}</h4>
            </div>
            <div class="button-store-wrapper" style={{ fontSize: '16px' }}>
                <Link to="#">Go To Store</Link>
            </div>
        </div>
    )
}

export default Store
