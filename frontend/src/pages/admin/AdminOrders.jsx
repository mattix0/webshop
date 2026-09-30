import { useEffect, useState } from "react"
import { fetchAllOrders, updateOrderStatus } from '../../js/order'
import { imageUrl } from '../../js/media'
import { errorMessage } from '../../js/errors'

const STATUSES = ['pending', 'paid', 'shipped', 'cancelled']

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
        timeStyle: 'short',
    }).format(new Date(value))
}

function orderTotal(order) {
    return order.items.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0
    )
}

function FilterTabs({ active, counts, onChange }) {
    const tabs = [
        { value: 'all', label: 'All' },
        ...STATUSES.map((value) => ({ value, label: value })),
    ]

    return (
        <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
                const isActive = active === tab.value
                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onChange(tab.value)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize whitespace-nowrap transition ${
                            isActive
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {tab.label}
                        <span className={isActive ? 'ml-1.5 text-gray-300' : 'ml-1.5 text-gray-400'}>
                            {counts[tab.value] ?? 0}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

function StatusSelect({ order, saving, onChange }) {
    const locked = order.status === 'cancelled'
    const style = STATUS_STYLES[order.status] || STATUS_STYLES.cancelled

    if (locked) {
        return (
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${style}`}>
                cancelled
            </span>
        )
    }

    return (
        <select
            value={order.status}
            disabled={saving}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
                event.stopPropagation()
                onChange(event.target.value)
            }}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 ${style}`}
        >
            {STATUSES.map((value) => (
                <option key={value} value={value}>
                    {value}
                </option>
            ))}
        </select>
    )
}

function OrderRow({ order, expanded, saving, onToggle, onStatusChange }) {
    return (
        <>
            <tr className="hover:bg-gray-50 cursor-pointer" onClick={onToggle}>
                <td className="px-6 py-4 font-medium">#{order.order_id}</td>
                <td className="px-6 py-4">
                    <div>{order.first_name} {order.last_name}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{formatDate(order.created_at)}</td>
                <td className="px-6 py-4">
                    <StatusSelect
                        order={order}
                        saving={saving}
                        onChange={onStatusChange}
                    />
                </td>
                <td className="px-6 py-4 text-right tabular-nums">
                    {formatPrice(orderTotal(order))}
                </td>
            </tr>

            {expanded && (
                <tr className="bg-gray-50">
                    <td colSpan={5} className="px-6 py-4">
                        <div className="text-xs uppercase text-gray-500 font-medium mb-3">
                            Items
                        </div>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.order_item_id} className="flex gap-4 items-center">
                                    <div className="w-12 h-12 shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
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

                        <div className="text-xs uppercase text-gray-500 font-medium mt-5 mb-2">
                            Shipping
                        </div>
                        <div className="text-sm text-gray-700">
                            <div>{order.first_name} {order.last_name}</div>
                            <div>{order.address}</div>
                            <div>{order.postal_code} {order.country}</div>
                            <div className="text-gray-500 mt-1">{order.phone}</div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedId, setExpandedId] = useState(null)
    const [savingId, setSavingId] = useState(null)
    const [saveError, setSaveError] = useState(null)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        fetchAllOrders()
            .then(setOrders)
            .catch((error) => {
                setError(errorMessage(error, "Failed to fetch orders."))
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    function toggle(orderId) {
        setExpandedId((prev) => (prev === orderId ? null : orderId))
    }

    async function handleStatusChange(orderId, newStatus) {
        setSavingId(orderId)
        setSaveError(null)
        try {
            const updated = await updateOrderStatus(orderId, newStatus)
            setOrders((prev) =>
                prev.map((order) =>
                    order.order_id === orderId ? updated : order
                )
            )
        } catch (error) {
            setSaveError(errorMessage(error, "Failed to update the order."))
        } finally {
            setSavingId(null)
        }
    }

    const counts = orders.reduce(
        (acc, order) => {
            acc.all += 1
            acc[order.status] = (acc[order.status] || 0) + 1
            return acc
        },
        { all: 0 }
    )

    const visible =
        filter === 'all'
            ? orders
            : orders.filter((order) => order.status === filter)

    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900">All orders</h3>
                {!loading && !error && (
                    <span className="text-sm text-gray-500">
                        {visible.length === 1 ? '1 order' : `${visible.length} orders`}
                    </span>
                )}
            </div>

            {!loading && !error && orders.length > 0 && (
                <FilterTabs active={filter} counts={counts} onChange={setFilter} />
            )}

            {saveError && (
                <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-6 py-3">
                    {saveError}
                </div>
            )}

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
                        {loading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && error && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    {error}
                                </td>
                            </tr>
                        )}

                        {!loading && !error && orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No orders yet
                                </td>
                            </tr>
                        )}

                        {!loading && !error && orders.length > 0 && visible.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No {filter} orders
                                </td>
                            </tr>
                        )}

                        {!loading && !error && visible.map((order) => (
                            <OrderRow
                                key={order.order_id}
                                order={order}
                                expanded={expandedId === order.order_id}
                                saving={savingId === order.order_id}
                                onToggle={() => toggle(order.order_id)}
                                onStatusChange={(value) =>
                                    handleStatusChange(order.order_id, value)
                                }
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminOrders