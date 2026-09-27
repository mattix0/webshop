import { useAuth } from '../../js/AuthContext'

function Overview() {
    const { user } = useAuth()

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
                    <h4 className="text-sm text-gray-600">Open orders</h4>
                    <p className="mt-2 text-2xl font-medium text-gray-900">0</p>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
                    <h4 className="text-sm text-gray-600">Delivered</h4>
                    <p className="mt-2 text-2xl font-medium text-gray-900">0</p>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 text-center">
                    <h4 className="text-sm text-gray-600">Saved items</h4>
                    <p className="mt-2 text-2xl font-medium text-gray-900">0</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
                {user?.username && (
                    <p className="mb-2">
                        Welcome{' '}
                        <span className="text-green-700 text-lg font-medium">
                            {user.username}
                        </span>
                    </p>
                )}
                <p className="text-gray-600">This is your account overview</p>
            </div>
        </>
    )
}

export default Overview
