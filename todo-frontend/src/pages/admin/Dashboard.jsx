import React, { useState, useEffect, useCallback } from 'react';
import api from "../../services/api";
import { useAuth } from '../../context/useAuth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.post("/user/getAllUsers", { page: currentPage, limit: 5 });
            setUsers(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    // Block/Unblock a user
    const handleBlockUnblock = async (userId, isBlocked) => {
        try {
            const res = await api.post(`/user/blockOrUnblockUser/${userId}`, { isBlock: !isBlocked });
            toast.success("User status update successfully");
            const updatedUser = res.data.data;
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                )
            );
        } catch (err) {
            console.error(err);
            setError("Failed to update user status");
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-dashboard">
            <h2 className="text-2xl font-bold mb-10 mt-10 text-center ">Admin Dashboard</h2>
            <button
                onClick={handleLogout}
                className="absolute top-5 right-5 bg-red-500 text-white py-2 px-4 rounded cursor-pointer"
            >
                Logout
            </button>

            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Mobile</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="py-2 px-4 border-b">{user.name}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">{user.mobile}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => handleBlockUnblock(user._id, user.isBlock)}
                                            className={`${user.isBlock ? 'bg-green-500' : 'bg-red-500'
                                                } text-white px-3 py-1 rounded cursor-pointer`}
                                        >
                                            {user.isBlock ? "Unblock" : "Block"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-10 text-center">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded mr-2 cursor-pointer"
                        >
                            Prev
                        </button>
                        <span className="mr-2">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};



export default AdminDashboard;
