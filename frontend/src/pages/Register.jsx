import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { registerUser } from '../js/auth'
import { validateRegisterForm } from '../js/formValidation'

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        pcontryone: '',
        postal_code: '',
    })
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState(null)
    const [loading, setLoading] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setServerError(null)

        const validationErrors = validateRegisterForm(formData)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
            return
        }

        setLoading(true)
        try {
            await registerUser(formData)
            navigate('/login', {
                state: { message: 'Account successfully created. You may now login.' },
            })
        } catch (error) {
            setServerError(error.response?.data?.detail || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px-56px)] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow border border-gray-200 w-80 px-6 py-8">
                <p className="text-lg font-medium text-gray-900 text-center mb-6">
                    Create an account
                </p>

                {serverError && (
                    <p className="text-sm text-red-600 text-center mb-3">{serverError}</p>
                )}

                <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        value={formData.username}
                        placeholder="Username"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.username && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.username}</p>
                    )}
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        placeholder="Password"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.password}</p>
                    )}
                    <input
                        type="text"
                        name="first_name"
                        onChange={handleChange}
                        value={formData.first_name}
                        placeholder="First name"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.first_name && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.first_name}</p>
                    )}
                    <input
                        type="text"
                        name="last_name"
                        onChange={handleChange}
                        value={formData.last_name}
                        placeholder="Last name"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.last_name && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.last_name}</p>
                    )}
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        placeholder="Email"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.email}</p>
                    )}
                    <input
                        type="tel"
                        name="phone"
                        onChange={handleChange}
                        value={formData.phone}
                        placeholder="Phone"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.phone && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.phone}</p>
                    )}
                    <input
                        type="text"
                        name="address"
                        onChange={handleChange}
                        value={formData.address}
                        placeholder="address"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.address && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.address}</p>
                    )}
                    <input
                        type="text"
                        name="country"
                        onChange={handleChange}
                        value={formData.country}
                        placeholder="Country"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.country && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.country}</p>
                    )}
                    <input
                        type="text"
                        name="postal_code"
                        onChange={handleChange}
                        value={formData.postal_code}
                        placeholder="Postal Code"
                        className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
                    />
                    {errors.postal_code && (
                        <p className="text-xs text-red-600 mt-1 ml-2">{errors.postal_code}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </form>

                <Link
                    to="/login"
                    className="block bg-zinc-400 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-500 transition mt-2 text-center"
                >
                    Back
                </Link>
            </div>
        </div>
    )
}

export default Register
