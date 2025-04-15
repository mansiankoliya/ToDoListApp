import React from 'react';
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const location = useLocation();
    const isUserLogin = location.pathname.includes("/user");

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full px-3 py-2 border rounded mb-3"
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full px-3 py-2 border rounded mb-4"
                />

                {isUserLogin && (
                    <div onClick={handleRegisterNavigate} className="mt-4 text-center cursor-pointer">
                        <p className="text-sm">
                            Don't have an account?{" "}
                            <span className="text-blue-500 hover:underline">
                                Register here
                            </span>
                        </p>
                    </div>
                )}

                <button type="submit" className="bg-blue-500 text-white w-full mt-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
                    Login
                </button>
            </form>
        </div>

    );
};

export default Login;