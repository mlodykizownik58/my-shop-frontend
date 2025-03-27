import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    // 📌 Wylogowanie admina
    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Elektronik</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">📦 Produkty</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">🛒 Koszyk</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">📞 Kontakt</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/faq">❓ FAQ</Link>
                        </li>
                      
                        

                        {/* 📌 Przycisk logowania admina */}
                        {isAdmin ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-warning" to="/admin">🛠️ Panel Admina</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}> Wyloguj się</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin/login">🔑 Zaloguj się</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
