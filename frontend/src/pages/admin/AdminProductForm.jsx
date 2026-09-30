import { Link, useNavigate, useParams } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { createProduct, updateProduct, fetchProduct, uploadProductImage } from "../../js/products"
import { imageUrl } from "../../js/media"
import { errorMessage } from "../../js/errors"
import { validateProductForm } from '../../js/formValidation'

function AdminProductForm() {
    const navigate = useNavigate()
    const { productId } = useParams()
    const isEdit = Boolean(productId)
    const fileInput = useRef(null)

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        sku: '',
    })
    const [imagePath, setImagePath] = useState(null)
    const [preview, setPreview] = useState(null)
    const [pendingFile, setPendingFile] = useState(null)
    const [imageError, setImageError] = useState(null)
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEdit)

    useEffect(() => {
        if (!isEdit) {
            return
        }

        fetchProduct(productId)
            .then((product) => {
                setFormData({
                    name: product.name ?? '',
                    price: String(product.price ?? ''),
                    stock: String(product.stock ?? ''),
                    sku: product.sku ?? '',
                })
                setImagePath(product.image_path ?? null)
            })
            .catch((error) => {
                setServerError(errorMessage(error, 'Failed to load the product.'))
            })
            .finally(() => {
                setFetching(false)
            })
    }, [productId, isEdit])

    // release the object URL when it is replaced or the form unmounts
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    function handleFileChange(event) {
        const file = event.target.files?.[0]
        setImageError(null)

        if (!file) {
            return
        }

        if (!file.type.startsWith('image/')) {
            setImageError('Pick an image file.')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageError('The image must be 5 MB or smaller.')
            return
        }

        if (preview) {
            URL.revokeObjectURL(preview)
        }

        setPendingFile(file)
        setPreview(URL.createObjectURL(file))
    }

    function clearImage() {
        if (preview) {
            URL.revokeObjectURL(preview)
        }
        setPreview(null)
        setPendingFile(null)
        setImagePath(null)
        setImageError(null)
        if (fileInput.current) {
            fileInput.current.value = ''
        }
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
            let path = imagePath

            if (pendingFile) {
                path = await uploadProductImage(pendingFile)
            }

            const payload = {
                name: formData.name.trim(),
                sku: formData.sku.trim(),
                price: Number(formData.price),
                stock: Number(formData.stock),
                image_path: path,
            }

            if (isEdit) {
                await updateProduct(productId, payload)
                navigate('/admin/products', {
                    state: { message: 'Product updated.' },
                })
            } else {
                await createProduct(payload)
                navigate('/admin/products', {
                    state: { message: 'Product created.' },
                })
            }
        } catch (error) {
            setServerError(
                errorMessage(
                    error,
                    isEdit ? 'Product update failed.' : 'Product creation failed.'
                )
            )
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 max-w-xl">
                <p className="text-sm text-gray-500">Loading...</p>
            </div>
        )
    }

    const shownImage = preview || imageUrl(imagePath)

    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 max-w-xl">
            <h3 className="text-base font-medium text-gray-900 mb-6">
                {isEdit ? 'Edit product' : 'New product'}
            </h3>

            {serverError && (
                <p className="text-sm text-red-600 mb-4">{serverError}</p>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                <div>
                    <span className="block text-xs font-medium text-gray-700 mb-1 ml-2">
                        Image
                    </span>
                    <div className="flex items-start gap-4">
                        <div className="w-28 h-28 shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                            {shownImage ? (
                                <img
                                    src={shownImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                            <input
                                ref={fileInput}
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleFileChange}
                                className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
                            />

                            {shownImage && (
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="text-xs text-gray-400 hover:text-red-600 transition text-left ml-1"
                                >
                                    Remove image
                                </button>
                            )}

                            <p className="text-xs text-gray-400 ml-1">
                                JPEG, PNG, WebP or GIF. Max 5 MB.
                            </p>
                        </div>
                    </div>
                    {imageError && (
                        <p className="text-xs text-red-600 mt-2 ml-2">{imageError}</p>
                    )}
                </div>

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
                        Price ($)
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
                        {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create product'}
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