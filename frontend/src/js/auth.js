import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN_KEY = "token"
const USER_KEY = "user"

axios.interceptors.request.use((config) => {
    const token = getToken()
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export async function registerUser(userData){
    const response = await axios.post(`${API_BASE_URL}/register`, userData)
    return response.data
}

export async function loginUser(credentials){
    const response = await axios.post(`${API_BASE_URL}/login`, credentials)
    return response.data
}

export async function fetchMe(){
    const response = axios.get(`${API_BASE_URL}/me`)
    return response.data
}

export function getToken(){
    return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(){
    const raw= localStorage.getItem(USER_KEY)
    if(!raw){
        return null
    }
    
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

export function storeSession(token, user){
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession(){
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}