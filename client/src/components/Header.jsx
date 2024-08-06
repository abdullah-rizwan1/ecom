import React from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext)
    const navigate = useNavigate()
    const logout = async () => {
        setAuth({})
        navigate('/')
    }
    return (
        <header class="site-header">
            <div class="site-identity">
                <h1>
                    <a href="#">Ecom</a>
                </h1>
            </div>
            <nav class="site-navigation">
                <ul class="nav">
                    <li>
                        <Link to="/supplier/stores">Supplier</Link>
                    </li>
                    <li>
                        {auth?.authorizationToken ? (
                            <div className="flexGrow">
                                <a className="logout" onClick={logout}>
                                    Logout
                                </a>
                            </div>
                        ) : (
                            <Link to="/login">Login</Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
