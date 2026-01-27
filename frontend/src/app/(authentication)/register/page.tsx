"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

interface RegisterProps {
  onToggleLogin?: () => void;
}

export default function RegisterPage({ onToggleLogin }: RegisterProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const InputBox = "border-b border-gray-300 py-1 focus:border-b-2 focus:border-purple-700 transition-colors focus:outline-none peer bg-inherit w-full text-white"
  const imgLogoPath = "/codevplay-white.svg";

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!username || !email || !password || !ConfirmPassword) {
    setError("Please fill in all fields");
    return;
  }

  if (password !== ConfirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.msg || "Registration failed");
    }

  
    window.location.href = "/login";
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

  <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 w-full max-w-md mx-6 p-8 space-y-8">
    <img
      className="block mx-auto h-10 mb-2 drop-shadow-lg"
      src={imgLogoPath}
      alt="Logo"
    />
    <h1 className="text-2xl text-center mb-1 font-noto-sans font-[Outfit]">
      Create new account
    </h1>
    <p className="text-sm text-center text-white/70 mb-6 font-[Roboto]">
      To start playing, fill it up!
    </p>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative mb-8">
        <input
            id="email"
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`${InputBox}`}
        />
        <label
            htmlFor="email"
            className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm text-white"
        >
            Email
        </label>
      </div>
      <div className="relative mb-8">
        <input
            id="username"
            type="text"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={`${InputBox}`}
        />
        <label
            htmlFor="username"
            className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm text-white"
        >
            Username
        </label>
      </div>
      <div className="relative mb-8">
        <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${InputBox}`}
        />
        <label
            htmlFor="password"
            className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm text-white"
        >
            Password
        </label>
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-700 focus:outline-none duration-200 cursor-pointer"
        >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      <div className="relative mb-8">
        <input
            id="confirmpassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder=""
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`${InputBox}`}
        />
        <label
            htmlFor="confirmpassword"
            className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm text-white"
        >
            Confirm Password
        </label>
        <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-700 focus:outline-none duration-200 cursor-pointer"
        >
            {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">
          {error}
        </p>
      )}

      
      <button
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold
                   bg-linear-to-r from-indigo-600 to-purple-600
                   hover:from-indigo-500 hover:to-purple-500
                   transition-all duration-200
                   hover:scale-[1.03]
                   hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      
      <p className="mt-4 text-sm text-center text-white/70">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => {
            const isMdScreen = window.innerWidth >= 768;
            if (isMdScreen && onToggleLogin) {
              onToggleLogin();
            } else {
              router.push("/login");
            }
          }}
          className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
        >
          Login here
        </button>
      </p>
    </form>
    <div className='flex justify-center z-20'>
        <a href='/' className='text-indigo-400 hover:text-indigo-700 duration-200 cursor-pointer'>Go Back</a>
    </div>
  </div>
</div>

  );
}
