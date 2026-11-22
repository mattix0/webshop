import { Routes, Route } from 'react-router'

import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'

import Overview from './pages/account/Overview'
import Orders from './pages/account/Orders'
import Profile from './pages/account/Profile'

import AdminOverview from './pages/admin/AdminOverview'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminProductForm from './pages/admin/AdminProductForm'


function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/account"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>}
            >
                <Route index element={<Overview />} />
                <Route path="orders" element={<Orders />} />
                <Route path="profile" element={<Profile />} />
            </Route>

            <Route
                path="/admin"
                element={
                    <RoleRoute allowed={['admin']}>
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route index element={<AdminOverview />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:productId/edit" element={<AdminProductForm />} />
                <Route path="customers" element={<AdminCustomers />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes