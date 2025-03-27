import React, { useEffect, useState } from "react";

const AdminStats = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch("http://localhost:5000/admin/stats");
            const data = await response.json();

            if (data) {
                setStats({
                    totalOrders: data.totalOrders || 0,
                    totalRevenue: data.totalRevenue ? parseFloat(data.totalRevenue).toFixed(2) : "0.00"
                });
            }
        } catch (err) {
            console.error("⛔ Błąd pobierania statystyk:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">📊 Statystyki sprzedaży</h2>
            <div className="row my-4">
                <div className="col-md-6">
                    <div className="card p-3 text-center shadow">
                        <h4>📦 Liczba zamówień</h4>
                        <h2>{stats.totalOrders}</h2>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3 text-center shadow">
                        <h4>💰 Suma sprzedaży</h4>
                        <h2>{stats.totalRevenue} zł</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
