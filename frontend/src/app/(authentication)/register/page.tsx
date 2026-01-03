
"use client"

import { useState } from "react"


export default function registerPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
         if(!username || !email || !password){
            setError("Please fill in all fields");
            return;
        } try {
            setLoading(true);
            setError("");
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Registration failed");
            }

            localStorage.setItem("token", data.token);
            console.log("Registration successful");

        } catch (err) {
            setError("Registration failed");
        }finally {
            setLoading(false);
        }
    }
    return(

        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-500 text-white p-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>

    )
}