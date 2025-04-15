import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: localStorage.getItem("accessToken") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        user: JSON.parse(localStorage.getItem("user")) || null,
    });

    const login = (data) => {
        const { accessToken, refreshToken, user } = data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
        localStorage.setItem("expirationTime", expirationTime);

        setAuth({ accessToken, refreshToken, user });
    };

    const logout = () => {
        localStorage.clear();
        setAuth({ accessToken: null, refreshToken: null, user: null });
    };

    const refreshAccessToken = async () => {
        try {
            const res = await axios.post('/user/refresh-token', {
                token: auth.refreshToken
            });
            const newToken = res.data.accessToken;
            localStorage.setItem("accessToken", newToken);
            setAuth(prev => ({ ...prev, accessToken: newToken }));
            return newToken;
        } catch {
            logout();
        }
    };

    useEffect(() => {
        const expirationTime = localStorage.getItem("expirationTime");
        if (expirationTime && Date.now() > expirationTime) {
            logout(); // Remove items from localStorage if expired
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
