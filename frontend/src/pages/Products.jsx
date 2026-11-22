import { useEffect, useState } from 'react'
import { fetchProducts } from '../js/products'
import { addToCart } from '../js/cart'
import { imageUrl } from '../js/media'

function QtyControl({ qty, max, onChange }) {
    return (
        <div className="flex items-center border border-gray-200 rounded-full">
            <button
                type="button"
                onClick={() => onChange(qty - 1)}
                disabled={qty <= 1}
                className="w-8 h-8 text-gray-500 hover:text-gray-900 transition disabled:text-gray-300"
                aria-label="Decrease quantity"
            >
                &minus;
            </button>
            <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
            <button
                type="button"
                onClick={() => onChange(qty + 1)}
                disabled={qty >= max}
                className="w-8 h-8 text-gray-500 hover:text-gray-900 transition disabled:text-gray-300"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    )
}

function ProductCard({ product }) {
    const soldOut = product.stock <= 0
    const [qty, setQty] = useState(1)

    function handleQty(next) {
        if (next < 1 || next > product.stock) {
            return
        }
        setQty(next)
    }

    function handleAdd() {
        addToCart(product, qty)
        setQty(1)
    }

    return (
        <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100 overflow-hidden relative">
                {product.image_path ? (
                    <img
                        src={imageUrl(product.image_path)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No image
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>

                <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                    <span className="text-base font-medium text-gray-900">
                        {product.price} $
                    </span>

                    {!soldOut && (
                        <QtyControl qty={qty} max={product.stock} onChange={handleQty} />
                    )}
                </div>

                <button
                    type="button"
                    disabled={soldOut}
                    onClick={handleAdd}
                    className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-indigo-700 transition disabled:bg-gray-200 disabled:text-gray-400 mt-3 w-full"
                >
                    Add
                </button>

                <span className="text-xs font-medium text-gray-400 mt-2">
                        In stock: {product.stock}
                    </span>
            </div>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-8 bg-gray-100 rounded-full w-full mt-4" />
            </div>
        </div>
    )
}

function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch((err) =>
                setError(err.response?.data?.detail || 'Failed to load products.')
            )
            .finally(() => setLoading(false))
    }, [])



    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-900">Products</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {loading ? 'Loading...' : `${products.length} items`}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-6 py-4">
                    {error}
                </div>
            )}

            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl px-6 py-20 text-center">
                    <p className="text-gray-900 font-medium">No products yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Check back later.
                    </p>
                </div>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Products