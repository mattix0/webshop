import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { loadCart, setQty, removeFromCart, clearCart, checkoutCart } from '../js/cart'
import { imageUrl } from '../js/media'

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price))
}

function QtyControl({ line, onChange }) {
    const atMax = line.qty >= line.stock

    return (
        <div className="flex items-center border border-gray-200 rounded-full">
            <button
                type="button"
                onClick={() => onChange(line.qty - 1)}
                className="w-8 h-8 text-gray-500 hover:text-gray-900 transition"
                aria-label="Decrease quantity"
            >
                &minus;
            </button>
            <span className="w-8 text-center text-sm tabular-nums">{line.qty}</span>
            <button
                type="button"
                onClick={() => onChange(line.qty + 1)}
                disabled={atMax}
                className="w-8 h-8 text-gray-500 hover:text-gray-900 transition disabled:text-gray-300"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    )
}

function CartLine({ line, onQty, onRemove }) {
    return (
        <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
            <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                {line.image_path ? (
                    <img
                        src={imageUrl(line.image_path)}
                        alt={line.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">{line.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{line.sku}</p>
                <p className="text-xs text-gray-500 mt-1">
                    {formatPrice(line.price)} each
                </p>

                <div className="mt-3 flex items-center gap-4">
                    <QtyControl line={line} onChange={onQty} />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-xs text-gray-400 hover:text-red-600 transition"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <div className="text-sm font-medium text-gray-900 tabular-nums">
                {formatPrice(line.price * line.qty)}
            </div>
        </div>
    )
}

function Cart() {
    const navigate = useNavigate()
    const [lines, setLines] = useState([])
    const [notices, setNotices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadCart()
            .then(({ lines, notices }) => {
                setLines(lines)
                setNotices(notices)
            })
            .catch((err) =>
                setError(err.response?.data?.detail || 'Failed to load cart.')
            )
            .finally(() => setLoading(false))
    }, [])

    function handleQty(productId, qty) {
        setQty(productId, qty)
        setLines((prev) =>
            qty <= 0
                ? prev.filter((l) => l.product_id !== productId)
                : prev.map((l) => (l.product_id === productId ? { ...l, qty } : l))
        )
    }

    function handleRemove(productId) {
        removeFromCart(productId)
        setLines((prev) => prev.filter((l) => l.product_id !== productId))
    }

    function handleClear() {
        clearCart()
        setLines([])
        setNotices([])
    }

    async function handleCheckout() {
        setSubmitting(true)
        setError(null)
        try {
            const order = await checkoutCart()
            setLines([])
            navigate('/account/orders', {
                state: { message: `Order #${order.order_id} placed.` },
            })
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login', { state: { from: { pathname: '/cart' } } })
                return
            }
            if (err.response?.status === 409) {
                const { lines, notices } = await loadCart()
                setLines(lines)
                setNotices(notices)
            }
            setError(err.response?.data?.detail || 'Checkout failed.')
        } finally {
            setSubmitting(false)
        }
    }

    const total = lines.reduce((sum, l) => sum + Number(l.price) * l.qty, 0)
    const count = lines.reduce((sum, l) => sum + l.qty, 0)

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="mt-8 space-y-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="w-20 h-20 bg-gray-100 rounded-xl" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-gray-100 rounded w-1/2" />
                                <div className="h-3 bg-gray-100 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-900">Cart</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {count === 1 ? '1 item' : `${count} items`}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-6 py-4 mb-6">
                    {error}
                </div>
            )}

            {notices.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl px-6 py-4 mb-6 space-y-1">
                    {notices.map((n, i) => (
                        <p key={i}>{n}</p>
                    ))}
                </div>
            )}

            {lines.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl px-6 py-20 text-center">
                    <p className="text-gray-900 font-medium">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Browse the products page to get started.
                    </p>
                </div>
            )}

            {lines.length > 0 && (
                <>
                    <div className="bg-white border border-gray-200 rounded-2xl px-6">
                        {lines.map((line) => (
                            <CartLine
                                key={line.product_id}
                                line={line}
                                onQty={(qty) => handleQty(line.product_id, qty)}
                                onRemove={() => handleRemove(line.product_id)}
                            />
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-sm text-gray-400 hover:text-red-600 transition"
                        >
                            Clear cart
                        </button>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-xl font-medium text-gray-900 tabular-nums">
                                {formatPrice(total)}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={submitting}
                        className="mt-6 w-full bg-indigo-600 text-white text-sm font-medium px-4 py-3 rounded-full hover:bg-indigo-700 transition disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        {submitting ? 'Placing order...' : 'Checkout'}
                    </button>
                </>
            )}
        </div>
    )
}

export default Cart