import React, { useEffect, useState } from "react";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/admin/users");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania użytkowników:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">👥 Zarządzanie użytkownikami</h2>
            <table className="table table-bordered text-center">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nazwa</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
