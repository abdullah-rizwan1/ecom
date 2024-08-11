import { useSelector, useDispatch } from 'react-redux'
import {
    selectAllStores,
    getStoresStatus,
    getStoresError,
    fetchStores,
} from './storeSlice'
import { setStatusIdle } from './productSlice'
import useAuth from '../hooks/useAuth'
import { useEffect } from 'react'
import Store from './Store'

const StoreList = () => {
    const dispatch = useDispatch()
    const { auth, setAuth } = useAuth()
    const stores = useSelector(selectAllStores)
    const storesStatus = useSelector(getStoresStatus)
    const error = useSelector(getStoresError)
    dispatch(setStatusIdle())
    useEffect(() => {
        if (storesStatus === 'idle') {
            dispatch(fetchStores(auth))
        }
    }, [storesStatus, dispatch])

    let content
    if (storesStatus === 'loading') {
        content = <p>Fetching Stores ....</p>
    } else if (storesStatus === 'succeeded') {
        content = stores.map((store) => (
            <Store
                key={store.store_id}
                store_name={store.store_name}
                store_logo={store.store_logo}
            />
        ))
    } else if (storesStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <h1>Stores</h1>
            <div className="store-list">{content}</div>
        </section>
    )
}

export default StoreList
