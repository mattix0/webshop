import { fetchAdminProducts, deactivateProduct, restoreProduct } from "../../js/products"
import { imageUrl } from "../../js/media"
import { errorMessage } from "../../js/errors"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router"

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price))
}

function AdminProducts() {
    const location = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(location.state?.message || null)
    const [actionError, setActionError] = useState(null)
    const [busyId, setBusyId] = useState(null)
    const [showInactive, setShowInactive] = useState(false)

    useEffect(() => {
        fetchAdminProducts()
            .then(setProducts)
            .catch((error) => {
                setError(errorMessage(error, "Failed to fetch products."))
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    function replaceProduct(updated) {
        setProducts((prev) =>
            prev.map((p) => (p.product_id === updated.product_id ? updated : p))
        )
    }

    async function handleDeactivate(productId) {
        setBusyId(productId)
        setActionError(null)
        setMessage(null)
        try {
            const updated = await deactivateProduct(productId)
            replaceProduct(updated)
            setMessage('Product removed from the shop.')
        } catch (error) {
            setActionError(errorMessage(error, "Failed to remove the product."))
        } finally {
            setBusyId(null)
        }
    }

    async function handleRestore(productId) {
        setBusyId(productId)
        setActionError(null)
        setMessage(null)
        try {
            const updated = await restoreProduct(productId)
            replaceProduct(updated)
            setMessage('Product is back in the shop.')
        } catch (error) {
            setActionError(errorMessage(error, "Failed to restore the product."))
        } finally {
            setBusyId(null)
        }
    }

    const inactiveCount = products.filter((p) => !p.is_active).length
    const visible = showInactive ? products : products.filter((p) => p.is_active)

    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900">Products</h3>
                <Link
                    to="/admin/products/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
                >
                    New product
                </Link>
            </div>

            {!loading && !error && inactiveCount > 0 && (
                <div className="px-6 py-3 border-b border-gray-200">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(event) => setShowInactive(event.target.checked)}
                            className="rounded border-gray-300"
                        />
                        Show removed products ({inactiveCount})
                    </label>
                </div>
            )}

            {message && (
                <div className="bg-green-50 border-b border-green-200 text-green-800 text-sm px-6 py-3">
                    {message}
                </div>
            )}

            {actionError && (
                <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-6 py-3">
                    {actionError}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium w-20"></th>
                            <th scope="col" className="px-6 py-3 font-medium">Name</th>
                            <th scope="col" className="px-6 py-3 font-medium">SKU</th>
                            <th scope="col" className="px-6 py-3 font-medium">Stock</th>
                            <th scope="col" className="px-6 py-3 font-medium">Price</th>
                            <th scope="col" className="px-6 py-3 font-medium text-right">Actions</th>
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

                        {!loading && error && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    {error}
                                </td>
                            </tr>
                        )}

                        {!loading && !error && visible.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No products yet
                                </td>
                            </tr>
                        )}

                        {!loading && !error && visible.map((product) => (
                            <tr
                                key={product.product_id}
                                className={product.is_active ? "hover:bg-gray-50" : "bg-gray-50 text-gray-400"}
                            >
                                <td className="px-6 py-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        {product.image_path ? (
                                            <img
                                                src={imageUrl(product.image_path)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {product.name}
                                    {!product.is_active && (
                                        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full border bg-white text-gray-500 border-gray-200">
                                            removed
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                                <td className="px-6 py-4">
                                    {product.stock === 0 ? (
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-gray-100 text-gray-600 border-gray-200">
                                            Out of stock
                                        </span>
                                    ) : (
                                        product.stock
                                    )}
                                </td>
                                <td className="px-6 py-4 tabular-nums">
                                    {formatPrice(product.price)}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    {product.is_active ? (
                                        <span className="inline-flex items-center gap-4">
                                            <Link
                                                to={`/admin/products/${product.product_id}/edit`}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                disabled={busyId === product.product_id}
                                                onClick={() => handleDeactivate(product.product_id)}
                                                className="text-xs font-medium text-gray-400 hover:text-red-600 disabled:opacity-50"
                                            >
                                                {busyId === product.product_id ? 'Removing...' : 'Remove'}
                                            </button>
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={busyId === product.product_id}
                                            onClick={() => handleRestore(product.product_id)}
                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                                        >
                                            {busyId === product.product_id ? 'Restoring...' : 'Restore'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminProducts