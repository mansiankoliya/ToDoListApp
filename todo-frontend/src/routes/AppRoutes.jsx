import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';

import AdminDashboard from '../pages/admin/Dashboard';

import UserRegister from '../pages/user/Register';
import UserDashboard from '../pages/user/Dashboard';
import Profile from '../pages/user/Profile';

import UserPrivateRoute from "../components/UserPrivateRoute";
import AdminPrivateRoute from "../components/AdminPrivateRoute";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/user/login" element={<Login />} />
                <Route path="/user/register" element={<UserRegister />} />

                {/* Protected Admin Routes */}
                <Route element={<AdminPrivateRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Protected User Routes */}
                <Route element={<UserPrivateRoute />}>
                    <Route path="/user/dashboard" element={<UserDashboard />} />
                    <Route path="/user/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<Login />} />
            </Routes>

        </Router>
    );
};

export default AppRoutes;
