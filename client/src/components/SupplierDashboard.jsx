import React from 'react'
import StoreList from './StoreList'
import '../styles/supplierDashboard.css'
const SupplierDashboard = () => {
    return (
        <div className="supplier-dashboard-container">
            <h1>Supplier Dashboard</h1>
            <StoreList />
        </div>
    )
}

export default SupplierDashboard
