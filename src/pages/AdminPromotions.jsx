import React, { useEffect, useState } from "react";

const AdminPromotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [newPromo, setNewPromo] = useState({
        code: "",
        discount: "",
        isPercentage: true,
        minOrderValue: "",
        expiryDate: ""
    });

    useEffect(() => {
        fetchPromotions();
    }, []);

    // 📌 Pobieranie listy promocji
    const fetchPromotions = async () => {
        try {
            const response = await fetch("http://localhost:5000/promotions");
            const data = await response.json();
            setPromotions(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania promocji:", err);
        }
    };

    // 📌 Obsługa zmian w formularzu dodawania promocji
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewPromo({
            ...newPromo,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // 📌 Dodawanie nowej promocji
    const addPromotion = async () => {
        if (!newPromo.code || !newPromo.discount || !newPromo.expiryDate) {
            alert("⚠️ Wypełnij wymagane pola!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/promotions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPromo)
            });

            if (response.ok) {
                alert("✅ Promocja dodana!");
                setNewPromo({ code: "", discount: "", isPercentage: true, minOrderValue: "", expiryDate: "" });
                fetchPromotions();
            } else {
                alert("⛔ Błąd dodawania promocji!");
            }
        } catch (err) {
            console.error("⛔ Błąd dodawania promocji:", err);
        }
    };

    // 📌 Usuwanie promocji
    const deletePromotion = async (id) => {
        if (!window.confirm("❌ Czy na pewno chcesz usunąć tę promocję?")) return;

        try {
            const response = await fetch(`http://localhost:5000/promotions/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("✅ Promocja usunięta!");
                fetchPromotions();
            } else {
                alert("⛔ Błąd usuwania promocji!");
            }
        } catch (err) {
            console.error("⛔ Błąd usuwania promocji:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">🎟️ Zarządzanie promocjami</h2>

            {/* 📌 Formularz dodawania nowej promocji */}
            <div className="card shadow-lg p-4 mb-5 bg-white rounded">
                <h4 className="mb-3">➕ Dodaj nową promocję</h4>
                <div className="row">
                    <div className="col-md-4 mb-2">
                        <input type="text" className="form-control" name="code" placeholder="Kod rabatowy" value={newPromo.code} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-2">
                        <input type="number" className="form-control" name="discount" placeholder="Wartość rabatu" value={newPromo.discount} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-2">
                        <select className="form-control" name="isPercentage" value={newPromo.isPercentage} onChange={handleChange}>
                            <option value="true">Procentowo (%)</option>
                            <option value="false">Kwotowo (zł)</option>
                        </select>
                    </div>
                    <div className="col-md-4 mb-2">
                        <input type="number" className="form-control" name="minOrderValue" placeholder="Minimalna kwota zamówienia" value={newPromo.minOrderValue} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-2">
                        <input type="date" className="form-control" name="expiryDate" value={newPromo.expiryDate} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-2 d-flex align-items-center">
                        <button className="btn btn-success w-100" onClick={addPromotion}>➕ Dodaj promocję</button>
                    </div>
                </div>
            </div>

            {/* 📌 Lista promocji */}
            <h4 className="text-center mb-3">📜 Lista promocji</h4>
            <div className="table-responsive">
                <table className="table table-hover table-bordered shadow-sm">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>Kod</th>
                            <th>Zniżka</th>
                            <th>Typ</th>
                            <th>Minimalna wartość zamówienia</th>
                            <th>Ważność</th>
                            <th>🛠️ Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {promotions.map((promo) => (
                            <tr key={promo.id}>
                                <td>{promo.code}</td>
                                <td>{promo.discount}{promo.isPercentage ? "%" : " zł"}</td>
                                <td>{promo.isPercentage ? "Procentowa" : "Kwotowa"}</td>
                                <td>{promo.minOrderValue ? `${promo.minOrderValue.toFixed(2)} zł` : "Brak"}</td>
                                <td>{new Date(promo.expiryDate).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm mx-1" onClick={() => deletePromotion(promo.id)}>❌ Usuń</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPromotions;
