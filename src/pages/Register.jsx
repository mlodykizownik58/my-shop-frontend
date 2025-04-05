import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Konto zostało utworzone!");
                navigate("/login");
            } else {
                alert(`⛔ Błąd: ${data.error}`);
            }
        } catch (err) {
            console.error("⛔ Błąd rejestracji:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">📝 Rejestracja</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Nazwa użytkownika" className="form-control mb-2" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Hasło" className="form-control mb-2" onChange={handleChange} required />
                <button type="submit" className="btn btn-success w-100">Zarejestruj się</button>
            </form>
        </div>
    );
};

export default Register;
