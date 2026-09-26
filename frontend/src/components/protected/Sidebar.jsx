import { Link } from 'react-router'

function Sidebar() {
    return (
        <aside className="sticky top-16 z-20 w-60 h-[calc(100vh-64px)] shrink-0 flex flex-col bg-white shadow-sm border-r border-gray-200">
            <p className="px-6 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Menu
            </p>
            <nav className="flex flex-col gap-0.5 px-3 pb-3 text-sm font-medium text-gray-600 overflow-y-auto">
                <Link to="/dashboard" className="hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-2.5 transition-colors">
                    Overview
                </Link>
                <Link to="/dashboard" className="hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-2.5 transition-colors">
                    Customers
                </Link>
                <Link to="/dashboard" className="hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-2.5 transition-colors">
                    Products
                </Link>
                <Link to="/dashboard" className="hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-2.5 transition-colors">
                    Settings
                </Link>
            </nav>
            <div className="mt-auto p-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick=""
                    className="w-full text-left text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 py-2.5 transition-colors"
                >
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default Sidebar