import React from 'react';
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
// import { FaGoogle } from 'react-icons/fa';

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const location = useLocation();
    const isUserLogin = !location.pathname.includes("/admin");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/user/login", form);
            login(res.data.data);
            if (res.data.data.user.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    const handleRegisterNavigate = () => {
        navigate("/user/register");
    };

    // const handleGoogleLogin = () => {
    //     const googleLoginWindow = window.open(
    //         "http://localhost:8000/api/user/auth/google",
    //         "_self",
    //         "width=500,height=600"
    //     );

    //     // Listen for the token from the popup
    //     window.addEventListener("message", (event) => {
    //         if (event.origin !== "http://localhost:8000") return;
    //         console.log("🚀 ~ window.addEventListener ~ event:", event)
    //         if (event.data && event.data.accessToken) {
    //             login(event.data);
    //             navigate("/user/dashboard");
    //         }
    //     });
    // };

    // const handleGoogleLogin = () => {
    //     const popup = window.open(
    //         "http://localhost:8000/api/user/auth/google",
    //         "_blank",
    //         "width=500,height=600"
    //     );

    //     const listener = (event) => {
    //         if (event.origin !== "http://localhost:8000") return;
    //         console.log("🚀 ~ listener ~ event:", event)

    //         if (event.data && event.data.accessToken) {
    //             console.log("----hello");

    //             login(event.data);
    //             navigate("/user/dashboard");
    //         }
    //         // Cleanup
    //         window.removeEventListener("message", listener);
    //     };

    //     window.addEventListener("message", listener);
    // };



    const handleGoogleLogin = () => {
        // window.open("http://localhost:8000/api/user/auth/google", "_self");
        // window.open("http://localhost:8000/api/user/auth/google", "_blank", "width=500,height=600");
        window.open("http://localhost:8000/api/user/auth/google", "_self")

    };

    return (
        // <div className="min-h-screen flex items-center justify-center bg-gray-100">
        //     <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        //         <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        //         {error && <p className="text-red-500 text-sm">{error}</p>}
        //         <input
        //             type="email"
        //             name="email"
        //             value={form.email}
        //             onChange={handleChange}
        //             placeholder="Email"
        //             required
        //             className="w-full px-3 py-2 border rounded mb-3"
        //         />
        //         <input
        //             type="password"
        //             name="password"
        //             value={form.password}
        //             onChange={handleChange}
        //             placeholder="Password"
        //             required
        //             className="w-full px-3 py-2 border rounded mb-4"
        //         />

        //         {isUserLogin && (
        //             <div onClick={handleRegisterNavigate} className="mt-4 text-center cursor-pointer">
        //                 <p className="text-sm">
        //                     Don't have an account?{" "}
        //                     <span className="text-blue-500 hover:underline">
        //                         Register here
        //                     </span>
        //                 </p>
        //             </div>
        //         )}

        //         <button type="submit" className="bg-blue-500 text-white w-full mt-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
        //             Login
        //         </button>
        //     </form>
        // </div>


        isUserLogin ? (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" >
                <form>
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <p className="text-center text-sm text-gray-600 mt-1 ">
                            Or
                            <a onClick={handleRegisterNavigate} className="text-indigo-600 hover:text-indigo-500 ml-1 font-medium cursor-pointer">create an account</a>
                        </p>

                        <div className="mt-6 space-y-4">
                            <div >
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email address"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            {/* <div className="flex items-center justify-between">
                                  <label className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                     <span className="ml-2">Remember me</span>
                                   </label>
                                 <div className="text-sm">
                                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
                                  </div>
                             </div> */}

                            <div>
                                <button type="submit" onClick={handleSubmit}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none cursor-pointer">
                                    Sign in
                                </button>
                            </div>
                        </div >

                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button onClick={handleGoogleLogin}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                                Continue with Google
                            </button>
                        </div>
                    </div>
                </form>
            </div >
        ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" >
                <form>
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email address"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <button type="submit" onClick={handleSubmit}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none cursor-pointer">
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    );
};

export default Login;