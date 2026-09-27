import { Outlet } from "react-router";
import Navbar from '../components/Navbar'

function PublicLayout() {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-64px-56px)] bg-gray-50">
                <Outlet />
            </main>
            <footer className="h-14 flex items-center justify-center bg-white border-t border-gray-200 text-sm text-gray-500">
                Webshop
            </footer>
        </>
    )
}

export default PublicLayout