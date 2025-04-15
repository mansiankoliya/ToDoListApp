import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminPrivateRoute = () => {
    const { auth } = useAuth();

    if (!auth.accessToken || auth.user?.role !== "ADMIN") {
        return <Navigate to="/admin/login" />;
    }

    return <Outlet />;
};

export default AdminPrivateRoute;