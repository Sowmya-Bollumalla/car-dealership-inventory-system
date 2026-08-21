import { Link } from 'react-router-dom'
import { Car } from 'lucide-react'

function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <Car size={30} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-slate-900">
          Login
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Sign in to your AutoDrive account
        </p>

        {/* Login Form */}
        <form className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login