import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchProducts } from '../js/products'
import { imageUrl } from '../js/media'
import { errorMessage } from '../js/errors'
import { useAuth } from '../js/AuthContext'

function ProductPreview({ product }) {
    const soldOut = product.stock <= 0

    return (
        <Link
            to="/products"
            className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
        >
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

                {soldOut && (
                    <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Sold out
                    </span>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-base font-medium text-gray-900 mt-2">
                    {product.price} $
                </p>
            </div>
        </Link>
    )
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
        </div>
    )
}

function Home() {
    const { isLoggedIn } = useAuth()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch((err) => {
                setError(errorMessage(err, 'Failed to load products.'))
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const featured = products.slice(0, 4)

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-16 text-center">
                <h1 className="text-3xl font-medium text-gray-900">
                    Welcome to the shop
                </h1>
                <p className="text-gray-500 mt-3 max-w-md mx-auto">
                    Browse the catalogue, add what you need to the cart and check out
                    in a couple of clicks.
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <Link
                        to="/products"
                        className="bg-indigo-600 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-indigo-700 transition"
                    >
                        Browse products
                    </Link>

                    {!isLoggedIn && (
                        <Link
                            to="/register"
                            className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full hover:border-gray-300 transition"
                        >
                            Create an account
                        </Link>
                    )}
                </div>
            </div>

            <div className="mt-10">
                <div className="flex items-end justify-between mb-5">
                    <h2 className="text-xl font-medium text-gray-900">Latest products</h2>
                    {!loading && !error && products.length > 4 && (
                        <Link
                            to="/products"
                            className="text-sm text-indigo-600 hover:text-indigo-700 transition"
                        >
                            See all {products.length}
                        </Link>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-6 py-4">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
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

                {!loading && !error && featured.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {featured.map((product) => (
                            <ProductPreview key={product.product_id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home