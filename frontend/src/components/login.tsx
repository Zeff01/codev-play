
export default function LoginPage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4 bg-gradient-to-br from-indigo-900 via-white to-purple-400">
      <div className="w-full max-w-sm rounded-xl shadow-lg p-6 border border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="w-full flex justify-center items-center mb-6">
          <img
            src="/codevplay-logo.svg"
            alt="Logo"
            className="h-40 w-44 object-contain"
          /> 
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>

        <form className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            className="w-full rounded-md bg-gray-200 p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded-md bg-gray-200 p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <p className="text-center text-sm">
          New User?{" "}
          <a href="#" className="text-blue-500 font-semibold hover:underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
}
