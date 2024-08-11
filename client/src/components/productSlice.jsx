import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import axios from '../api/axios'
const initialState = {
    products: [],
    status: 'idle',
    error: null,
}

const PRODUCTS_URL = '/api/home/products'
const STORE_URL = '/api/supplier/store/'

export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async () => {
        const response = await axios.get(PRODUCTS_URL)
        return response.data.result
    }
)

export const fetchProductsForStore = createAsyncThunk(
    'product/fetchProductsForStore',
    async ([auth, store_name]) => {
        const response = await axios.get(`${STORE_URL}${store_name}/products`, {
            headers: { 'authorization-token': auth.authorizationToken },
        })
        return response.data.result
    }
)

export const fetchProductDetails = createAsyncThunk(
    'product/fetchProductDetails',
    async (product_id) => {
        const response = await axios.get(`/api/home/${product_id}`)
        return response.data.result
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        productAdded: {
            reducer(state, action) {
                state.products.push(action.payload)
            },
            prepare(make, model, variant, store_id) {
                return {
                    payload: {
                        product_id: nanoid(),
                        make,
                        model,
                        variant,
                        store_id,
                    },
                }
            },
        },
        setStatusIdle(state) {
            state.status = 'idle'
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.products = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'rejected'
                state.error = action.error.message
            })
            .addCase(fetchProductsForStore.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchProductsForStore.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.products = action.payload
            })
            .addCase(fetchProductsForStore.rejected, (state, action) => {
                state.status = 'rejected'
                state.error = action.error.message
            })
            .addCase(fetchProductDetails.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.products = action.payload
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.status = 'rejected'
            })
    },
})

export const selectAllProducts = (state) => state.product.products
export const getProductsStatus = (state) => state.product.status
export const getProductsError = (state) => state.product.error

export const { productAdded, setStatusIdle } = productSlice.actions
export default productSlice.reducer
