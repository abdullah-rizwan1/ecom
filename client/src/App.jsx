import Register from './components/Register'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import SupplierDashboard from './components/SupplierDashboard'
import Missing from './components/Missing'
import Home from './components/Home'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                <Route element={<RequireAuth />}>
                    <Route
                        path="supplier/stores"
                        element={<SupplierDashboard />}
                    />
                </Route>

                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    )
}

export default App
