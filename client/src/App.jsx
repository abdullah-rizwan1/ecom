import Register from './components/Register'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import SupplierDashboard from './components/SupplierDashboard'
import Missing from './components/Missing'
import Home from './components/Home'
import ProductsList from './components/ProductsList'
import ProductDetail from './components/ProductDetail'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="products" element={<Home />} />
                <Route path="/:product_id" element={<ProductDetail />} />

                <Route element={<RequireAuth />}>
                    <Route
                        path="supplier/stores"
                        element={<SupplierDashboard />}
                    />
                    <Route
                        path="supplier/stores/:store_name"
                        element={<ProductsList />}
                    />
                </Route>

                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    )
}

export default App
