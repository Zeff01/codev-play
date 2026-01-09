'use client';


import React, { JSX } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';



export default function LoginPage  (): JSX.Element {
    const logoPath = "/CODEVLOGO.svg";
    const inputBox = "bg-gray-800 text-white rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-100 ";
    const errorInputBox = "bg-gray-800 text-white rounded-md px-4 py-2 mt-2 border-2 border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 w-100 ";

    const [emailorUsername, setEmailorUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const { login } = useAuth();
    const router = useRouter();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailorUsername || !password ) {
            setError("Please fill in all fields");
            return;
        }
        if (emailorUsername.length < 8) {
            setError("Email or username must be at least 8 characters");
            return;

      
        }try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: emailorUsername, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.msg || "Login failed");
            }

           login(data.user, data.token);
           router.push("/");
        } catch (err: any) {    
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 text-white">
            <div>
                <img src="/CODEVPLAY-IMAGE1.png" alt="Login Image" className="w-full h-full object-cover hidden md:block" />
            </div>
            <div className="flex flex-col md:flex items-center justify-center bg-linear-to-b from-[#0f172a] to-black backdrop-blur-sm font-noto-sans">
                 <img  className = "justify-center max-h-35 mt-4 justify-self-start"  src={logoPath}  alt="CODEVPLAY Logo" />
                <div className='flex flex-col justify-start items-center w-full mt-0 mb-0'>
                    <h1 className="font-bold text-3xl ">Welcome Back to CODEVPLAY! </h1>
                    <h2 className=''>Please Sign In to your account</h2>
                </div>
            <div className='flex'>
                <form onSubmit={handleLogin} className="flex flex-col w-full max-w-md mt-4">
                    <label className="text-sm font-medium">Email</label>
                    <input type="email" className={`${inputBox} ${error ? errorInputBox : ""}`} placeholder="Enter your email or Username" value={emailorUsername} onChange={(e) => {setEmailorUsername(e.target.value);setError("");}} />
                    <label className="text-sm font-medium mt-4">Password</label>
                    <input type="password" className={`${inputBox} ${error ? errorInputBox : ""}`} placeholder="Enter your password" value={password} onChange={(e) => {setPassword(e.target.value);setError("");}} />
                    <div className='flex'>
                        <a href="/forgot-password" className="text-sm text-shadow-white hover:text-indigo-400 mt-2">Forgot Password?</a>
                        <input className='ml-40' type="checkbox" /> Show Password
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm mt-3 text-center">
                            {error}
                        </p>
                    )}

                    <button type="submit" 

                        
                         className="bg-indigo-600
                             hover:bg-indigo-700
                             text-white 
                            font-semibold
                             py-2 
                             px-4 
                             rounded-md 
                             mt-6 
                             hover:scale-[1.02]
                            hover:shadow-lg
                            transition-all
                            ">
                        Sign In
                    </button>
                    <label htmlFor="Register" className="mt-4 text-sm self-center">
                        New User? <a href="/register" className="text-indigo-400 hover:underline">Register here</a>
                    </label>


                </form>
            </div>
            </div>
        </div>
        

    )
}

