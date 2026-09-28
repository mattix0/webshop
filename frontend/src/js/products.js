import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchProducts(){
    const response = await axios.get(`${API_BASE_URL}/products`)
    return response.data
}

export async function fetchProduct(id){
    const response = await axios.get(`${API_BASE_URL}/product/${id}`)
    return response.data
}

export async function createProduct(data){
    const response = await axios.post(`${API_BASE_URL}/product/new`, data)
    return response.data
}