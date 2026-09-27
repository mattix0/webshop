import { Link } from 'react-router'

function NotFound() {
    return (
        <div className="min-h-[calc(100vh-64px-56px)] flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-medium text-gray-900">404</p>
            <p className="text-gray-600">This page does not exist.</p>
            <Link
                to="/"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
            >
                Back to the shop
            </Link>
        </div>
    )
}

export default NotFound
