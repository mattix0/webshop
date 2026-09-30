import { useEffect, useState } from "react"
import { useLocation } from "react-router"
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

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.cancelled

    return (
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${style}`}>
            {status}
        </span>
    )
}

function OrderRow({ order, expanded, onToggle }) {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <>
            <tr className="hover:bg-gray-50 cursor-pointer" onClick={onToggle}>
                <td className="px-6 py-4">
                    <div className="font-medium">#{order.order_id}</div>
                    <div className="text-xs text-gray-500">
                        {itemCount === 1 ? '1 item' : `${itemCount} items`}
                    </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{formatDate(order.created_at)}</td>
                <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-right tabular-nums">
                    {formatPrice(orderTotal(order))}
                </td>
            </tr>

            {expanded && (
                <tr className="bg-gray-50">
                    <td colSpan={4} className="px-6 py-5">
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.order_item_id} className="flex gap-4 items-center">
                                    <div className="w-14 h-14 shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
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
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-gray-900">{item.product_name}</div>
                                        <div className="text-xs text-gray-500">{item.sku}</div>
                                    </div>
                                    <div className="text-sm text-gray-600 tabular-nums whitespace-nowrap">
                                        {item.quantity} &times; {formatPrice(item.unit_price)}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 tabular-nums w-24 text-right">
                                        {formatPrice(item.unit_price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-xs uppercase text-gray-500 font-medium mt-6 mb-2">
                            Shipped to
                        </div>
                        <div className="text-sm text-gray-700">
                            <div>{order.first_name} {order.last_name}</div>
                            <div>{order.address}</div>
                            <div>{order.postal_code} {order.country}</div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

function Orders() {
    const location = useLocation()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedId, setExpandedId] = useState(null)
    const [message, setMessage] = useState(location.state?.message || null)

    useEffect(() => {
        fetchMyOrders()
            .then(setOrders)
            .catch((error) => {
                setError(error.response?.data?.detail || "Failed to fetch your orders.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    function toggle(orderId) {
        setExpandedId((prev) => (prev === orderId ? null : orderId))
    }

    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900">My orders</h3>
                {!loading && !error && orders.length > 0 && (
                    <span className="text-sm text-gray-500">
                        {orders.length === 1 ? '1 order' : `${orders.length} orders`}
                    </span>
                )}
            </div>

            {message && (
                <div className="bg-green-50 border-b border-green-200 text-green-800 text-sm px-6 py-3">
                    {message}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">Order</th>
                            <th scope="col" className="px-6 py-3 font-medium">Date</th>
                            <th scope="col" className="px-6 py-3 font-medium">Status</th>
                            <th scope="col" className="px-6 py-3 font-medium text-right">Total</th>
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

                        {!loading && !error && orders.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    You have no orders yet
                                </td>
                            </tr>
                        )}

                        {!loading && !error && orders.map((order) => (
                            <OrderRow
                                key={order.order_id}
                                order={order}
                                expanded={expandedId === order.order_id}
                                onToggle={() => toggle(order.order_id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Orders