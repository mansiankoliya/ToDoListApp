import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [image, setImage] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");

    const { logout, auth } = useAuth();
    const navigate = useNavigate();

    const fetchTasks = async (page = currentPage) => {
        setLoading(true);
        try {
            const res = await api.post("/task/getTaskByUser", {
                page,
                limit: 5,
                userId: auth.user._id,
                filter: {
                    title: searchTerm,
                    status: filterStatus
                }
            });
            setTasks(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        } catch (err) {
            setError("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const handleAddTask = () => {
        setIsEditing(false);
        setEditTaskId(null);
        setTitle("");
        setDescription("");
        setStatus("PENDING");
        setImage(null);
        setShowModal(true);
    };

    const handleAddTaskSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("status", status);

        if (isEditing) {
            formData.append('id', editTaskId)
        } else {
            formData.append("owner", auth.user._id);
        }
        if (image) formData.append("image", image);

        try {
            if (isEditing) {
                // UPDATE API
                const res = await api.post(`/task/updateTask`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Task updated successfully!");
            } else {
                // CREATE API
                const res = await api.post("/task/createTask", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Task created successfully!");
            }

            // Reset & refresh
            setShowModal(false);
            setTitle("");
            setDescription("");
            setStatus("PENDING");
            setImage(null);
            fetchTasks();

        } catch (err) {
            console.error(err);
            toast.error(isEditing ? "Failed to update task." : "Failed to create task.");
        }
    };

    const handleEditTask = (task) => {
        setIsEditing(true);
        setEditTaskId(task._id);
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setImage(null);
        setShowModal(true);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const res = await api.delete(`/task/deleteTask/${taskId}`);
            if (res.data.success === true) {
                fetchTasks();
                toast.success("Task delete successfully!");
            }
        } catch (err) {
            setError("Failed to delete task");
        }
    }

    const handleNavigateProfile = () => {
        navigate("/user/profile")
    }

    useEffect(() => {
        setCurrentPage(1);
        fetchTasks(1);
    }, [filterStatus]);

    useEffect(() => {
        fetchTasks(currentPage);
    }, [currentPage]);

    const handleLogout = () => {
        logout();
        navigate('/user/login');
    };

    return (
        <div className="admin-dashboard">
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <h3 className="text-lg font-bold mb-4">{isEditing ? "Update Task" : "Add New Task"}</h3>
                        <form onSubmit={handleAddTaskSubmit} encType="multipart/form-data">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border px-3 py-2 mb-3"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border px-3 py-2 mb-3"
                                required
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border px-3 py-2 mb-3"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="INPROGRESS">INPROGRESS</option>
                            </select>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="mb-3"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-400 px-4 py-2 rounded cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                                >
                                    {isEditing ? "Update Task" : "Add Task"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-10 mt-10 text-center ">User Dashboard</h2>

            <button
                onClick={handleNavigateProfile}
                className="absolute top-5 right-25 text-black py-2 px-3 border-1 mr-2 border-black rounded cursor-pointer"
            >
                Profile
            </button>
            <button
                onClick={handleLogout}
                className="absolute top-5 right-5 bg-red-500 text-white py-2 px-3 rounded cursor-pointer"
            >
                LogOut
            </button>

            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <button
                        onClick={handleAddTask}
                        className="absolute top-25 right-5 bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
                    >
                        Add
                    </button>

                    <div className="flex justify-between items-center mb-0 mt-25 px-5">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchTasks(1)}
                            className="border px-4 py-2 rounded w-1/2"
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                            }}
                            className="border px-4 py-2 rounded ml-4"
                        >
                            <option value="ALL">All</option>
                            <option value="PENDING">Pending</option>
                            <option value="INPROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <table className="min-w-full border-collapse mt-15">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Title</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Image</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    <td className="py-2 px-4 border-b">{task.title}</td>
                                    <td className="py-2 px-4 border-b">{task.description}</td>
                                    <td className="py-2 px-4 border-b">{task.status}</td>
                                    <td className="py-2 px-4 border-b">
                                        <img src={task.image} alt={task.title} className="w-16 h-16 object-cover rounded" />
                                    </td>

                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => handleEditTask(task)}
                                            className='bg-yellow-500 text-white px-2 py-1 rounded cursor-pointer'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className='bg-red-500 text-white px-2 ml-5 py-1 rounded cursor-pointer'
                                        >
                                            Delete
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



export default UserDashboard;
