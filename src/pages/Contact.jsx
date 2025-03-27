import React, { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("✅ Wiadomość wysłana!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="container mt-5">
            <h2>📞 Kontakt</h2>
            <p>Masz pytania? Skontaktuj się z nami!</p>
            <form onSubmit={handleSubmit} className="mt-4">
                <input type="text" className="form-control mb-2" name="name" placeholder="Twoje imię" value={formData.name} onChange={handleChange} required />
                <input type="email" className="form-control mb-2" name="email" placeholder="Twój e-mail" value={formData.email} onChange={handleChange} required />
                <textarea className="form-control mb-2" name="message" rows="4" placeholder="Treść wiadomości" value={formData.message} onChange={handleChange} required />
                <button type="submit" className="btn btn-primary">📨 Wyślij wiadomość</button>
            </form>
        </div>
    );
};

export default Contact;
