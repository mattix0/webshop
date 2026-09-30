import { api } from './api'

export async function fetchProducts() {
    const response = await api.get('/products')
    return response.data
}

export async function fetchAdminProducts() {
    const response = await api.get('/admin/products')
    return response.data
}

export async function fetchProduct(id) {
    const response = await api.get(`/product/${id}`)
    return response.data
}

export async function createProduct(data) {
    const response = await api.post('/product/new', data)
    return response.data
}

export async function updateProduct(id, data) {
    const response = await api.patch(`/product/${id}`, data)
    return response.data
}

export async function deactivateProduct(id) {
    const response = await api.delete(`/product/${id}`)
    return response.data
}

export async function restoreProduct(id) {
    const response = await api.patch(`/product/${id}`, { is_active: true })
    return response.data
}

export async function uploadProductImage(file) {
    const body = new FormData()
    body.append('file', file)

    const response = await api.post('/upload/product-image', body)
    return response.data.image_path
}