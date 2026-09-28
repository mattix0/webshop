import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { createProduct } from "../../js/products"
import { validateProductForm } from '../../js/formValidation'

function AdminProductForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        sku: '',
    })
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState(null)
    const [loading, setLoading] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setServerError(null)

        const validationErrors = validateProductForm(formData)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
            return
        }

        setLoading(true)
        try {
            await createProduct(formData)
            navigate('/admin/products', {
                state: { message: 'Product created.' },
            })
        } catch (error) {
            setServerError(error.response?.data?.detail || 'Product creation failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 max-w-xl">
            <h3 className="text-base font-medium text-gray-900 mb-6">New product</h3>

            {serverError && (
                <p className="text-sm text-red-600 mb-4">{serverError}</p>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1 ml-2">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.name && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="sku" className="block text-xs font-medium text-gray-700 mb-1 ml-2">
                        SKU
                    </label>
                    <input
                        id="sku"
                        type="text"
                        name="sku"
                        onChange={handleChange}
                        value={formData.sku}
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.sku && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.sku}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="price" className="block text-xs font-medium text-gray-700 mb-1 ml-2">
                        Price (kr.)
                    </label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        step="0.01"
                        min="0"
                        onChange={handleChange}
                        value={formData.price}
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.price && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.price}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="stock" className="block text-xs font-medium text-gray-700 mb-1 ml-2">
                        Stock
                    </label>
                    <input
                        id="stock"
                        type="number"
                        name="stock"
                        step="1"
                        min="0"
                        onChange={handleChange}
                        value={formData.stock}
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.stock && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.stock}</p>
                    )}
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Create product'}
                    </button>

                    <Link
                        to="/admin/products"
                        className="bg-zinc-400 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-500 transition text-center"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default AdminProductForm
