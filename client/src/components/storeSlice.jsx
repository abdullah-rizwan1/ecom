import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'

import axios from '../api/axios'

const STORE_URL = '/api/supplier/store/list'

const initialState = {
    stores: [],
    status: 'idle',
    error: null,
}

export const fetchStores = createAsyncThunk(
    'store/fetchStores',
    async (auth) => {
        const response = await axios.get(STORE_URL, {
            headers: { 'authorization-token': auth.authorizationToken },
        })
        return response.data.result
    }
)

const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        storeAdded: {
            reducer(state, action) {
                state.stores.push(action.payload)
            },
            prepare(title, logo, owner) {
                return {
                    payload: {
                        store_id: nanoid(),
                        store_name: title,
                        store_logo: logo,
                        supplier_id: owner,
                    },
                }
            },
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchStores.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.stores = action.payload
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.status = 'rejected'
                state.error = action.error.message
            })
    },
})

export const selectAllStores = (state) => state.store.stores
export const getStoresStatus = (state) => state.store.status
export const getStoresError = (state) => state.store.error

export const { storeAdded } = storeSlice.actions

export default storeSlice.reducer
