import InputField from "@/app/ui/util/input-field";
import Image from "next/image";

interface LoginFormProps {
  postUrl: string;
}

export default function LoginForm({ postUrl }: LoginFormProps) {
  return (
      <div className="flex min-h-screen items-center justify-center px-6 bg-gray-100">
        {/* Blur Overlay */}
        <form action={postUrl} method="POST" className="w-full max-w-lg rounded-xl bg-white p-16 shadow-1xl">
          {/* Title */}
          <h1 className="mb-10 text-center text-4xl font-bold text-gray-900">
            Login
          </h1>

          <div className="space-y-8">
            {/* Email Input */}
            <div>
              <InputField type="email" placeholder="Enter your email" required minLength={0} name="email" />
            </div>

            {/* Password Input */}
            <div>
              <InputField type="password" placeholder="Enter your password" required minLength={6} name="password" />
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
              <Image src="/microsoft_logo.png" width={512} height={512} alt="Microsoft Logo" className="h-6 w-6 mr-3" />

              Sign in with Microsoft
            </button>
          </div>
        </form>
      </div>
  );
}
