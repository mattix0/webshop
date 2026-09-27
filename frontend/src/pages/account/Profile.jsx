import { useAuth } from '../../js/AuthContext'

function Profile() {
    const { user } = useAuth()

    const rows = [
        { label: 'Username', value: user?.username },
        { label: 'First Name', value: user?.first_name },
        { label: 'Last Name', value: user?.last_name },
        { label: 'Email', value: user?.email },
        { label: 'Phone', value: user?.phone },
    ]

    return (
        <div className='bg-white rounded-2xl shadow border border-gray-200 p-6 max-w-xl'>
            <h3 className='text-base font-medium text-gray-900 mb-4'>Profile</h3>

            <dl className='divide-y divide-gray-100 text-sm'>
                {rows.map(({ label, value }) => (
                    <div key={label} className='flex justify-between py-3'>
                        <dt className='text-gray-600'>{label}</dt>
                        <dd className='text-gray-600'>{value || '-'}</dd>
                    </div>
                ))}
            </dl>

        </div>
    )
}

export default Profile