import { fetchProducts } from "../../js/products"
import { useEffect, useState } from "react"
import { Link } from "react-router"

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState()
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch((error) => {
                setError(error.response?.data.detail || "Failed to fetch products.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])


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

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">Name</th>
                            <th scope="col" className="px-6 py-3 font-medium">SKU</th>
                            <th scope="col" className="px-6 py-3 font-medium">Stock</th>
                            <th scope="col" className="px-6 py-3 font-medium">Price</th>
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

                        {!loading && !error && products.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No products yet
                                </td>
                            </tr>
                        )}

                        {!loading && !error && products.map((product) =>
                            <tr key={product.product_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{product.name}</td>
                                <td className="px-6 py-4">{product.sku}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4">{product.price}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminProducts
