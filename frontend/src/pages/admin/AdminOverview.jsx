import { useAuth } from '../../js/AuthContext'
import { useEffect, useState } from "react"
import { fetchCostumers } from '../../js/costumer'
import { fetchProducts } from '../../js/products'

function AdminOverview() {
    const { user } = useAuth()
    const [customers, setCostumers] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState()
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCostumers()
            .then(setCostumers)
            .catch((error) => {
                setError(error.response?.data.detail || "Failed to fetch costumers.")
            })
            .finally(() => {
                setLoading(false)
            })

            fetchProducts()
            .then(setProducts)
            .catch((error) => {
                setError(error.response?.data.detail || "Failed to fetch products.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])


    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
                    <h4 className="text-sm text-gray-600">Pending</h4>
                    <p className="mt-2 text-2xl font-medium text-gray-900">0</p>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
                    <h4 className="text-sm text-gray-600">Shipping</h4>
                    <p className="mt-2 text-2xl font-medium text-gray-900">0</p>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
                    <h4 className="text-sm text-gray-600">Done</h4>
                    <p className="mt-2 text-2xl font-medium text-gray-900">0</p>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
                    <h4 className="text-sm text-gray-600">Products</h4>
                    {products && (
                        <p className="mt-2 text-2xl font-medium text-gray-900">{products.length}</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
                    <h4 className="text-sm text-gray-600">Customers</h4>
                    {customers && (
                        <p className="mt-2 text-2xl font-medium text-gray-900">{customers.length}</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                {user?.username && (
                    <p className="mb-2">
                        Welcome{' '}
                        <span className="text-green-700 text-lg font-medium">
                            {user.username}
                        </span>
                    </p>
                )}
                <p className="text-gray-600">This is the admin dashboard</p>
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-200 mt-5 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-base font-medium text-gray-900">Recent orders</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-medium">Order</th>
                                <th scope="col" className="px-6 py-3 font-medium">Customer</th>
                                <th scope="col" className="px-6 py-3 font-medium">Date</th>
                                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                                <th scope="col" className="px-6 py-3 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-900">
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No orders yet
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default AdminOverview
