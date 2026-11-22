import { useAuth } from '../../js/AuthContext'
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { fetchCostumers } from '../../js/costumer'
import { fetchAdminProducts } from '../../js/products'
import { fetchAllOrders } from '../../js/order'
import { imageUrl } from '../../js/media'

const STATUS_STYLES = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    paid: 'bg-green-50 text-green-800 border-green-200',
    shipped: 'bg-blue-50 text-blue-800 border-blue-200',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price))
}

function formatDate(value) {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
    }).format(new Date(value))
}

function orderTotal(order) {
    return order.items.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0
    )
}

function StatCard({ label, value, loading, to, highlight }) {
    const body = (
        <>
            <h4 className="text-sm text-gray-600">{label}</h4>
            {loading ? (
                <div className="mt-3 h-6 bg-gray-100 rounded w-10 mx-auto animate-pulse" />
            ) : (
                <p className={`mt-2 text-2xl font-medium tabular-nums ${
                    highlight ? 'text-amber-600' : 'text-gray-900'
                }`}>
                    {value}
                </p>
            )}
        </>
    )

    const className = "bg-white rounded-2xl shadow border border-gray-200 p-5 text-center block"

    if (to) {
        return (
            <Link to={to} className={`${className} hover:border-gray-300 transition`}>
                {body}
            </Link>
        )
    }

    return <div className={className}>{body}</div>
}

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.cancelled

    return (
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${style}`}>
            {status}
        </span>
    )
}

function AdminOverview() {
    const { user } = useAuth()
    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        Promise.all([
            fetchCostumers(),
            fetchAdminProducts(),
            fetchAllOrders(),
        ])
            .then(([customerData, productData, orderData]) => {
                setCustomers(customerData)
                setProducts(productData)
                setOrders(orderData)
            })
            .catch((error) => {
                setError(error.response?.data?.detail || "Failed to load the dashboard.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const pending = orders.filter((o) => o.status === 'pending').length
    const paid = orders.filter((o) => o.status === 'paid').length
    const shipped = orders.filter((o) => o.status === 'shipped').length

    const revenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + orderTotal(o), 0)

    const activeProducts = products.filter((p) => p.is_active)
    const outOfStock = activeProducts.filter((p) => p.stock === 0).length

    const recent = orders.slice(0, 5)

    return (
        <>
            <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                    Admin dashboard
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Signed in as {user?.username}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-6 py-4 mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <StatCard
                    label="Pending"
                    value={pending}
                    loading={loading}
                    to="/admin/orders"
                    highlight={pending > 0}
                />
                <StatCard label="Paid" value={paid} loading={loading} to="/admin/orders" />
                <StatCard label="Shipped" value={shipped} loading={loading} to="/admin/orders" />
                <StatCard
                    label="Revenue"
                    value={formatPrice(revenue)}
                    loading={loading}
                />
                <StatCard
                    label="Products"
                    value={activeProducts.length}
                    loading={loading}
                    to="/admin/products"
                />
                <StatCard
                    label="Customers"
                    value={customers.length}
                    loading={loading}
                    to="/admin/customers"
                />
            </div>

            {!loading && outOfStock > 0 && (
                <Link
                    to="/admin/products"
                    className="block bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl px-6 py-3 mb-6 hover:border-amber-300 transition"
                >
                    {outOfStock === 1
                        ? '1 product is out of stock.'
                        : `${outOfStock} products are out of stock.`}
                </Link>
            )}

            <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-base font-medium text-gray-900">Recent orders</h3>
                    {!loading && !error && orders.length > 5 && (
                        <Link
                            to="/admin/orders"
                            className="text-sm text-indigo-600 hover:text-indigo-700 transition"
                        >
                            View all
                        </Link>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-medium w-24"></th>
                                <th scope="col" className="px-6 py-3 font-medium">Order</th>
                                <th scope="col" className="px-6 py-3 font-medium">Customer</th>
                                <th scope="col" className="px-6 py-3 font-medium">Date</th>
                                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                                <th scope="col" className="px-6 py-3 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-900">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No orders yet
                                    </td>
                                </tr>
                            )}

                            {!loading && !error && recent.map((order) => (
                                <tr key={order.order_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3">
                                        <div className="flex -space-x-3">
                                            {order.items.slice(0, 3).map((item) => (
                                                <div
                                                    key={item.order_item_id}
                                                    className="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden border-2 border-white"
                                                >
                                                    {item.image_path ? (
                                                        <img
                                                            src={imageUrl(item.image_path)}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">#{order.order_id}</td>
                                    <td className="px-6 py-4">
                                        <div>{order.first_name} {order.last_name}</div>
                                        <div className="text-xs text-gray-500">{order.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {formatDate(order.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right tabular-nums">
                                        {formatPrice(orderTotal(order))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default AdminOverview