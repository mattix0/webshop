import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getToken, getStoredUser, storeSession, storeUser, clearSession, fetchMe } from "./auth"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getToken())
    const [user, setUser] = useState(getStoredUser())
    const [loading, setLoading] = useState(Boolean(getToken()))

    const login = useCallback((newToken, newUser) => {
        storeSession(newToken, newUser)
        setToken(newToken)
        setUser(newUser)
    }, [])

    const logout = useCallback(() => {
        clearSession()
        setToken(null)
        setUser(null)
    }, [])

    useEffect(() => {
        window.addEventListener('auth:expired', logout)
        return () => window.removeEventListener('auth:expired', logout)
    }, [logout])

    useEffect(() => {
        if (!token) {
            setLoading(false)
            return
        }

        let cancelled = false

        fetchMe()
            .then((me) => {
                if (cancelled) return
                storeUser(me)
                setUser(me)
            })
            .catch((err) => {

                if (!cancelled && err.response?.status !== 401) {
                    console.error('Failed to refresh session:', err)
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [token])

    const value = {
        token,
        user,
        role: user?.role ?? null,
        isLoggedIn: Boolean(token),
        loading,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth has to be used in AuthProvider.')
    }
    return context
}