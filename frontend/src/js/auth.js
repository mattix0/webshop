import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'

export async function registerUser(userData){
    const response = await axios.post(`${API_BASE_URL}/register`, userData)
    return response.data
}

export async function loginUser(credentials){
    const response = await axios.post(`${API_BASE_URL}/login`, credentials)
    return response.data
}