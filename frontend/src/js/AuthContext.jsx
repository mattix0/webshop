import { createContext, useContext, useState } from "react";
import { getToken, getStoredUser, storeSession, clearSession } from "./auth"

const AuthContext = createContext(null)

export function AuthProvider({ children }){
    const [token, setToken] = useState(getToken())
    const [user, setUser] = useState(getStoredUser())

    function login(newToken, newUser){
        storeSession(newToken, newUser)
        setToken(newToken)
        setUser(newUser)
    }

    function logout(){
        clearSession()
        setToken(null)
        setUser(null)
    }

    const value = {
        token,
        user,
        role: user?.role ?? null,
        isLoggedIn: Boolean(token),
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error('useAuth has to be used in AuthProvider.')
    }
    return context
}