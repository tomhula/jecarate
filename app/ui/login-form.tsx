import { lusitana } from '@/app/ui/fonts';
export default function LoginForm() {
  return (
      <div className="flex min-h-screen items-center justify-center px-6 bg-gray-100">
        {/* Blur Overlay */}
        <form className="w-full max-w-lg rounded-xl bg-white p-16 shadow-1xl">
          {/* Title */}
          <h1 className="mb-10 text-center text-4xl font-bold text-gray-900">
            Login
          </h1>

          <div className="space-y-8">
            {/* Email Input */}
            <div>
              <input
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-6 py-4 text-xl text-gray-900 placeholder-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700"
                  type="email"
                  placeholder="Enter email"
                  required
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-6 py-4 text-xl text-gray-900 placeholder-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700"
                  type="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
              />
            </div>

            {/* Sign In Button */}
            <button
                className="w-full rounded-xl bg-blue-500 py-4 text-xl font-bold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="submit"
            >
              SIGN IN
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">Login with other accounts</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Microsoft Login Button */}
            <button
                className="w-full flex items-center justify-center rounded-xl border border-gray-300 bg-white py-4 text-xl font-bold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                type="button"
            >
              <img src="/microsoft_logo.png" alt="Microsoft Logo" className="h-6 w-6 mr-3"/>

              Sign in with Microsoft
            </button>
          </div>
        </form>
      </div>
  );
}
