import { Link } from 'react-router-dom'
const Store = ({ store_name, store_logo }) => {
    return (
        <Link to={`${store_name}`}>
            <div className="store-container" style={{ marginLeft: '16px' }}>
                <div className="store-wrapper">
                    <div className="banner-image">
                        <img
                            src={store_logo}
                            alt="store logo"
                            height="150px"
                            width="150px"
                        />
                    </div>
                    <h4>{store_name}</h4>
                </div>
            </div>
        </Link>
    )
}

export default Store
