import React, { useState } from "react";

const AdminTracking = () => {
    const [orderId, setOrderId] = useState("");
    const [newStatus, setNewStatus] = useState("");

    const updateStatus = async () => {
        const response = await fetch("http://localhost:5000/tracking/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: newStatus })
        });

        const data = await response.json();
        alert(data.message || data.error);
    };

    return (
        <div className="container mt-5">
            <h2>🚚 Zarządzanie Przesyłkami</h2>
            <input type="number" placeholder="ID zamówienia" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="">Wybierz status</option>
                <option value="Wysłane">Wysłane</option>
                <option value="W drodze">W drodze</option>
                <option value="Dostarczone">Dostarczone</option>
            </select>
            <button onClick={updateStatus}>Zaktualizuj</button>
        </div>
    );
};

export default AdminTracking;
