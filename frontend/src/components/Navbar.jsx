import { Link } from 'react-router'

function Navbar() {

    return (
        <header class="flex items-center justify-between pr-6 py-3 shadow bg-white">
            <div class="flex items-center space-x-4 px-6 ">
                <Link to="/" class="px-5 py-2 text-l font-medium ">
                    Webshop
                </Link>
            </div>
                <nav class="items-center justify-center bg-white/50 backdrop-blur flex-col md:flex-row flex gap-2 text-gray-900 text-sm font-normal">
                    <Link to="/" class="hover:text-indigo-600 hover:bg-gray-200 rounded p-2">
                        Home
                    </Link>
                    <Link to="/products" class="hover:text-indigo-600 hover:bg-gray-200 rounded p-2">
                        Products
                    </Link>
                    <Link to="/card" class="hover:text-indigo-600 hover:bg-gray-200 rounded p-2">
                        Card
                    </Link>
                    <div class="flex items-center space-x-4">
                        <Link to="/login" class="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
                            Login
                        </Link>
                    </div>
                </nav>
        </header>
    )
}

export default Navbar