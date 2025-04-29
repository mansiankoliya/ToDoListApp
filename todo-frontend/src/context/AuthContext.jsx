import { createContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: localStorage.getItem("accessToken") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        user: JSON.parse(localStorage.getItem("user")) || null,
    });

    const refreshTimeoutRef = useRef(null);

    const logout = useCallback(() => {
        clearTimeout(refreshTimeoutRef.current);
        localStorage.clear();
        setAuth({ accessToken: null, refreshToken: null, user: null });
    }, []);

    const refreshAccessToken = useCallback(async () => {
        try {
            const res = await axios.post('/user/refresh-token', {
                token: auth.refreshToken
            });
            const newToken = res.data.accessToken;
            localStorage.setItem("accessToken", newToken);

            const newExpirationTime = Date.now() + 60 * 60 * 1000;
            localStorage.setItem("expirationTime", newExpirationTime);

            setAuth(prev => ({ ...prev, accessToken: newToken }));

            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }

            const currentTime = Date.now();
            const timeUntilExpiry = newExpirationTime - currentTime;
            const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

            if (refreshTime > 0) {
                refreshTimeoutRef.current = setTimeout(() => {
                    refreshAccessToken();
                }, refreshTime);
            } else {
                refreshAccessToken();
            }

            return newToken;
        } catch {
            logout();
        }
    }, [auth.refreshToken, logout]);

    const login = (data) => {
        const { accessToken, refreshToken, user } = data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        const expirationTime = Date.now() + 60 * 60 * 1000;
        localStorage.setItem("expirationTime", expirationTime);

        setAuth({ accessToken, refreshToken, user });

        // Setup auto refresh
        const timeUntilExpiry = expirationTime - Date.now();
        const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

        if (refreshTime > 0) {
            refreshTimeoutRef.current = setTimeout(() => {
                refreshAccessToken();
            }, refreshTime);
        } else {
            refreshAccessToken();
        }
    };

    useEffect(() => {
        const expirationTime = parseInt(localStorage.getItem("expirationTime"));
        if (expirationTime && Date.now() < expirationTime) {
            const timeUntilExpiry = expirationTime - Date.now();
            const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

            if (refreshTime > 0) {
                refreshTimeoutRef.current = setTimeout(() => {
                    refreshAccessToken();
                }, refreshTime);
            } else {
                refreshAccessToken();
            }
        }
    }, [refreshAccessToken]);

    return (
        <AuthContext.Provider value={{ auth, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// export const useAuth = () => useContext(AuthContext);
export default AuthContext;
