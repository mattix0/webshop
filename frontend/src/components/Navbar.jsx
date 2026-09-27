import { Link } from 'react-router'
import { useAuth } from '../js/AuthContext'


function Navbar() {
    const { isLoggedIn, role } = useAuth()
    const homeLink = role === 'admin' ? '/admin' : '/account'

    return (
        <header className="sticky top-0 z-30 h-16 flex flex-row items-center justify-between pr-6 py-3 shadow bg-white">
            <div className="flex items-center space-x-4 px-6 ">
                <Link to="/" className="px-5 py-2 text-l font-medium ">
                    Webshop
                </Link>
            </div>
            <nav className="items-center justify-center bg-white/50 backdrop-blur flex-col md:flex-row flex gap-2 text-gray-900 text-sm font-normal">
                <Link to="/" className="hover:text-indigo-600 hover:bg-gray-100 rounded px-3 py-2 transition">
                    Home
                </Link>
                <Link to="/products" className="hover:text-indigo-600 hover:bg-gray-100 rounded px-3 py-2 transition">
                    Products
                </Link>
                <Link to="/cart" className="hover:text-indigo-600 hover:bg-gray-100 rounded px-3 py-2 transition">
                    Cart
                </Link>

                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <Link to={homeLink} className="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
                            {role === 'admin' ? 'Admin' : 'My account'}
                        </Link>
                    ) :
                        (
                            <Link to="/login" className="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
                                Login
                            </Link>
                        )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar