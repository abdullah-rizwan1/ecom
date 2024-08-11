import { configureStore } from '@reduxjs/toolkit'
import storeReducer from '../components/storeSlice'
import productReducer from '../components/productSlice'

export const store = configureStore({
    reducer: {
        store: storeReducer,
        product: productReducer,
    },
})
