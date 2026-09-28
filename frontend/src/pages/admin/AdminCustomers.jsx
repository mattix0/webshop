import { useEffect, useState } from "react"
import { fetchCostumers } from '../../js/costumer'

function AdminCustomers() {
    const [customers, setCostumers] = useState([])
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
    }, [])


    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900">Customers</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">Username</th>
                            <th scope="col" className="px-6 py-3 font-medium">First Name</th>
                            <th scope="col" className="px-6 py-3 font-medium">Last Name</th>
                            <th scope="col" className="px-6 py-3 font-medium">Email</th>
                            <th scope="col" className="px-6 py-3 font-medium">Phone</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                        {loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && error && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    {error}
                                </td>
                            </tr>
                        )}

                        {!loading && !error && customers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No customers yet.
                                </td>
                            </tr>
                        )}

                        {!loading && !error && customers.map((customer) =>
                            <tr key={customer.user_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{customer.username}</td>
                                <td className="px-6 py-4">{customer.first_name}</td>
                                <td className="px-6 py-4">{customer.last_name}</td>
                                <td className="px-6 py-4">{customer.email}</td>
                                <td className="px-6 py-4">{customer.phone}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminCustomers
