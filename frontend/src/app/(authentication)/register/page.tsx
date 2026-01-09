"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ConfirmPassword, setConfirmPassword] = useState("");


  const imgLogoPath = "/CODEVLOGO.svg";

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

  
  <div className="absolute inset-0 bg-[url('/CODEVPLAY-IMAGE1.png')] bg-cover bg-center blur-md scale-110" />

 
  <div className="absolute inset-0 bg-black/40" />

  
  <div className="relative z-10 w-full max-w-sm mx-6
                  rounded-3xl
                  bg-black/60 backdrop-blur-xl
                  border border-white/10
                  shadow-2xl
                  p-8">

   
    <img
      className="block mx-auto h-36 mb-6 drop-shadow-lg"
      src={imgLogoPath}
      alt="Logo"
    />

    <h1 className="text-2xl font-bold text-center mb-1 font-noto-sans">
      Create new account
    </h1>
    <p className="text-sm text-center text-white/70 mb-6">
      To start playing, fill it up!
    </p>

    <form onSubmit={handleSubmit} className="space-y-4">

     
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl
                   bg-white/10 border border-white/20
                   placeholder-white/50
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   transition"
      />

      
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-3 rounded-xl
                   bg-white/10 border border-white/20
                   placeholder-white/50
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   transition"
      />

      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl
                   bg-white/10 border border-white/20
                   placeholder-white/50
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   transition"
      />

      
      <input
        type="password"
        placeholder="Confirm Password"
        value={ConfirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl
                   bg-white/10 border border-white/20
                   placeholder-white/50
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   transition"
      />

      {error && (
        <p className="text-red-400 text-sm text-center">
          {error}
        </p>
      )}

      
      <button
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold
                   bg-gradient-to-r from-indigo-600 to-purple-600
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
        <a
          href="/login"
          className="text-indigo-400 hover:text-indigo-300 hover:underline"
        >
          Login here
        </a>
      </p>
    </form>
  </div>
</div>

  );
}
