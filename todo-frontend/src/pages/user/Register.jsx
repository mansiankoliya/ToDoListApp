import React from 'react';
import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
    const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/user/register", form);
            if (res.data.success === true) {
                const userData = res.data.data;
                localStorage.setItem("user", JSON.stringify(userData));
                navigate("/user/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Register failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <input
                    type="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="name"
                    required
                    className="w-full px-3 py-2 border rounded mb-3"
                />
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
                    type="number"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="mobile"
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

                <button type="submit" className="bg-blue-500 text-white w-full mt-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
                    Register
                </button>
            </form>
        </div>

    );
};

export default UserRegister;