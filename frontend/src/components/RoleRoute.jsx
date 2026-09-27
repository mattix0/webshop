import { Navigate, useLocation } from "react-router";
import { useAuth } from '../js/AuthContext'

function RoleRoute({ allowed, children }) {
    const { isLoggedIn, role } = useAuth()
    const location = useLocation()

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    if(!allowed.includes(role)){
        return <Navigate to="/account" replace />
    }

    return children
}

export default RoleRoute