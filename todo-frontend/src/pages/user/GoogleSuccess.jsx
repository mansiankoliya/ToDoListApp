import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const query = new URLSearchParams(location.search);

        const accessToken = query.get("accessToken");
        console.log("🚀 ~ useEffect ~ accessToken:", accessToken)

        const refreshToken = query.get("refreshToken");
        console.log("🚀 ~ useEffect ~ refreshToken:", refreshToken)

        const user = JSON.parse(decodeURIComponent(query.get("user")));
        console.log("🚀 ~ useEffect ~ user:", user)

        const data = {
            accessToken,
            refreshToken,
            user
        }
        if (accessToken && refreshToken && user) {
            login(data);
            navigate("/user/dashboard");
        } else {
            navigate("/user/login");
        }
    }, []);

    return <div>Logging you in...</div>;
};

export default GoogleSuccess;