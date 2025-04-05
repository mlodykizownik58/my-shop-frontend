import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // 📌 Obsługa logowania
    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "1234") {
            localStorage.setItem("isAdmin", "true");
            navigate("/admin"); // 📌 Przekierowanie do głównego panelu admina
        } else {
            setError("⛔ Nieprawidłowy login lub hasło!");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">🔑 Logowanie Admina</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin} className="mx-auto" style={{ maxWidth: "400px" }}>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-primary w-100">🔐 Zaloguj</button>
            </form>
        </div>
    );
};

export default AdminLogin;
