import { Outlet } from "react-router";
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function AdminLayout() {
    return (
        <>
            <Navbar />
            <div className="flex min-h-[calc(100vh-64px)] items-start bg-gray-50">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default AdminLayout