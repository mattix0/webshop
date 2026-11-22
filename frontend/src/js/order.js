import { api } from './api'

export async function fetchAllOrders() {
    const response = await api.get('/orders')
    return response.data
}

export async function updateOrderStatus(orderId, status) {
    const response = await api.patch(`/orders/${orderId}`, { status })
    return response.data
}

export async function fetchMyOrders() {
    const response = await api.get('/my-orders')
    return response.data
}

export async function fetchMyOrder(orderId) {
    const response = await api.get(`/my-orders/${orderId}`)
    return response.data
}