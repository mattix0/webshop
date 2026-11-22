import { api } from './api'

const TOKEN_KEY = "token"
const USER_KEY = "user"

export async function registerUser(userData) {
    const response = await api.post('/register', userData)
    return response.data
}

export async function loginUser(credentials) {
    const response = await api.post('/login', credentials)
    return response.data
}

export async function fetchMe() {
    const response = await api.get('/me')
    return response.data
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) {
        return null
    }
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

export function storeSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function storeUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}