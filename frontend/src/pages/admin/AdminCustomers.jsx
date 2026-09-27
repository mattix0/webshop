function AdminCustomers() {
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
                            <th scope="col" className="px-6 py-3 font-medium">Name</th>
                            <th scope="col" className="px-6 py-3 font-medium">Email</th>
                            <th scope="col" className="px-6 py-3 font-medium">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                No customers yet
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminCustomers
