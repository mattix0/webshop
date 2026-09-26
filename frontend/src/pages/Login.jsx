import Navbar from '../components/Navbar'
import { Link, useLocation, useNavigate } from 'react-router'
import { useState } from 'react'
import { loginUser } from '../js/auth'
import { validateLoginForm } from '../js/formValidation'

function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const message = location.state?.message
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

    const validationErrors = validateLoginForm(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      await loginUser(formData)
      navigate('/dashboard', { state: { username: formData.username } })

    } catch (error) {
      setServerError(error.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow border border-gray-200 w-80 px-6 py-8">
          <p className="text-lg font-medium text-gray-900 text-center mb-6">
            Login
          </p>

          {serverError && (
            <p className='text-sm text-red-600 text-center mb-3'>{serverError}</p>
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
              <p className='text-xs text-red-600 mt-1 ml-2'>{errors.username}</p>
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
              <p className='text-xs text-red-600 mt-1 ml-2'>{errors.password}</p>
            )}

            <Link
              to="/register"
              className="text-sm text-gray-500 hover:text-indigo-600 pl-2"
            >
              Register a new account?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition mt-2"
            >
              Login
            </button>

          </form>

          {message && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-4 text-center">
              {message}
            </p>
          )}

        </div>
      </div>
    </>
  )
}

export default Login