import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div className="container mt-5">
            
            <h2 className="text-center mb-4">🛠️ Panel Administracyjny</h2>

            <div className="row text-center">
                <div className="col-md-3 mb-3">
                    <Link to="/admin/orders" className="btn btn-primary w-100 p-3">
                        📦 Zamówienia
                    </Link>
                </div>
                <div className="col-md-3 mb-3">
                    <Link to="/admin/products" className="btn btn-success w-100 p-3">
                        🛍️ Produkty
                    </Link>
                </div>
                
               
                <div className="col-md-3 mb-3">
                    <Link to="/admin/categories" className="btn btn-secondary w-100 p-3">
                        📂 Kategorie
                    </Link>
                </div>
           
            </div>
        </div>
    );
};

export default AdminDashboard;
