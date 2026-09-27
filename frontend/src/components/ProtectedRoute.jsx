import { Navigate, useLocation } from "react-router";
import { useAuth } from '../js/AuthContext'

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth()
    const location = useLocation()

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    return children
}

export default ProtectedRoute