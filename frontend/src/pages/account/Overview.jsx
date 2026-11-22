import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../js/AuthContext'
import { fetchMyOrders } from '../../js/order'
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

function StatCard({ label, value, loading }) {
    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
            <h4 className="text-sm text-gray-600">{label}</h4>
            {loading ? (
                <div className="mt-3 h-6 bg-gray-100 rounded w-12 mx-auto animate-pulse" />
            ) : (
                <p className="mt-2 text-2xl font-medium text-gray-900 tabular-nums">
                    {value}
                </p>
            )}
        </div>
    )
}

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.cancelled

    return (
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${style}`}>
            {status}
        </span>
    )
}

function Overview() {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchMyOrders()
            .then(setOrders)
            .catch((error) => {
                setError(error.response?.data?.detail || 'Failed to load your orders.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const openOrders = orders.filter(
        (order) => order.status === 'pending' || order.status === 'paid'
    ).length

    const delivered = orders.filter((order) => order.status === 'shipped').length

    const totalSpent = orders
        .filter((order) => order.status !== 'cancelled')
        .reduce((sum, order) => sum + orderTotal(order), 0)

    const recent = orders.slice(0, 3)

    return (
        <>
            <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                    Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Signed in as {user?.username}
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <StatCard label="Open orders" value={openOrders} loading={loading} />
                <StatCard label="Shipped" value={delivered} loading={loading} />
                <StatCard
                    label="Total spent"
                    value={formatPrice(totalSpent)}
                    loading={loading}
                />
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-base font-medium text-gray-900">Recent orders</h3>
                    {!loading && !error && orders.length > 3 && (
                        <Link
                            to="/account/orders"
                            className="text-sm text-indigo-600 hover:text-indigo-700 transition"
                        >
                            View all
                        </Link>
                    )}
                </div>

                {loading && (
                    <div className="px-6 py-5 space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex gap-4 items-center animate-pulse">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="px-6 py-12 text-center text-gray-500 text-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-900 font-medium">No orders yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Anything you order will show up here.
                        </p>
                        <Link
                            to="/products"
                            className="inline-block mt-4 bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-indigo-700 transition"
                        >
                            Browse products
                        </Link>
                    </div>
                )}

                {!loading && !error && recent.length > 0 && (
                    <div className="divide-y divide-gray-200">
                        {recent.map((order) => {
                            const itemCount = order.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                            )

                            return (
                                <Link
                                    key={order.order_id}
                                    to="/account/orders"
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                                >
                                    <div className="flex -space-x-3">
                                        {order.items.slice(0, 3).map((item) => (
                                            <div
                                                key={item.order_item_id}
                                                className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border-2 border-white"
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

                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900">
                                            Order #{order.order_id}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(order.created_at)}
                                            {' \u00b7 '}
                                            {itemCount === 1 ? '1 item' : `${itemCount} items`}
                                        </div>
                                    </div>

                                    <StatusBadge status={order.status} />

                                    <div className="text-sm font-medium text-gray-900 tabular-nums w-24 text-right">
                                        {formatPrice(orderTotal(order))}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}

export default Overview