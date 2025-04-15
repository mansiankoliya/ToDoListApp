import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { auth } = useAuth();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/user/profile/${auth.user._id}`);
            setUserData(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
            {userData ? (
                <div className="space-y-4">
                    <div>
                        <strong>Name:</strong> {userData.name}
                    </div>
                    <div>
                        <strong>Email:</strong> {userData.email}
                    </div>
                    <div>
                        <strong>Mobile:</strong> {userData.mobile || 'N/A'}
                    </div>
                </div>
            ) : (
                <p className="text-red-500">User data not found</p>
            )}
            {/* Back button */}
            <div className="mt-6 text-center">
                <button
                    onClick={() => navigate("/user/dashboard")}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    )
}

export default Profile