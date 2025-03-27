import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.role);
                alert("✅ Zalogowano!");
                navigate(data.role === "admin" ? "/admin" : "/");
            } else {
                alert(`⛔ Błąd: ${data.error}`);
            }
        } catch (err) {
            console.error("⛔ Błąd logowania:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">🔑 Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Hasło" className="form-control mb-2" onChange={handleChange} required />
                <button type="submit" className="btn btn-primary w-100">Zaloguj się</button>
            </form>
        </div>
    );
};

export default Login;
