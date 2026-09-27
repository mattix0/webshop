import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../js/AuthContext'

const ACCOUNT_LINKS = [
    { to: '/account', label: 'Overview', end: true },
    { to: '/account/orders', label: 'My orders' },
    { to: '/account/profile', label: 'Profile' },
]

const ADMIN_LINKS = [
    { to: '/admin', label: 'Overview', end: true },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/customers', label: 'Customers' },
]

function linkClass({ isActive }) {
    const base = 'rounded-lg px-3 py-2.5 transition-colors'
    const state = isActive
        ? 'bg-indigo-50 text-indigo-600'
        : 'hover:text-indigo-600 hover:bg-indigo-50'
    return `${base} ${state}`
}

function Sidebar() {
    const { role, logout } = useAuth()
    const navigate = useNavigate()
    const links = role === 'admin' ? ADMIN_LINKS : ACCOUNT_LINKS

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <aside className="sticky top-16 z-20 w-60 h-[calc(100vh-64px)] shrink-0 flex flex-col bg-white shadow-sm border-r border-gray-200">
            <p className="px-6 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {role === 'admin' ? 'Admin' : 'Menu'}
            </p>

            <nav className="flex flex-col gap-0.5 px-3 pb-3 text-sm font-medium text-gray-600 overflow-y-auto">
                {links.map(({ to, label, end }) => (
                    <NavLink key={to} to={to} end={end} className={linkClass}>
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto p-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 py-2.5 transition-colors"
                >
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default Sidebar