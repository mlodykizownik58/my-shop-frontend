import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/admin">🔧 Admin Panel</Link>
                <div className="navbar-nav">
                    <Link className="nav-link text-white" to="/admin/orders">📦 Zamówienia</Link>
                    <Link className="nav-link text-white" to="/admin/products">🛍️ Produkty</Link>
                    <Link className="nav-link text-white" to="/admin/users">👥 Użytkownicy</Link>
                    <Link className="nav-link text-white" to="/admin/stats">📊 Statystyki</Link>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;