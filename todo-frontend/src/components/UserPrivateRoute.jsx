import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const UserPrivateRoute = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        return <Navigate to="/user/login" />;
    }


    return <Outlet />;
};

export default UserPrivateRoute;
