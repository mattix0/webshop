import Navbar from '../components/Navbar'
import { Link } from 'react-router'

function Login() {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow border border-gray-200 w-80 px-6 py-8">
          <p className="text-lg font-medium text-gray-900 text-center mb-6">
            Login
          </p>

          <form className="flex flex-col gap-3">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full text-gray-900 focus:outline-none focus:border-indigo-600"
            />

            <Link
              to="/register"
              className="text-sm text-gray-500 hover:text-indigo-600 pl-2"
            >
              Register a new account?
            </Link>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition mt-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login