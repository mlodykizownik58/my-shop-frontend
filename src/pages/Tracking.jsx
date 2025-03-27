import React, { useState } from "react";

const Tracking = () => {
    const [orderId, setOrderId] = useState("");
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState("");

    const fetchTrackingInfo = async () => {
        if (!orderId) {
            setError("❌ Podaj ID zamówienia!");
            return;
        }
        setError("");

        try {
            const response = await fetch(`http://localhost:5000/orders/tracking/${orderId}`);
            const data = await response.json();

            if (response.ok) {
                setTrackingData(data);
            } else {
                setError(data.error);
                setTrackingData(null);
            }
        } catch (err) {
            setError("⛔ Błąd połączenia z serwerem.");
            setTrackingData(null);
        }
    };

    return (
        <div className="container mt-5">
            <h2>📦 Śledzenie Paczki</h2>
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Podaj ID zamówienia"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
            />
            <button className="btn btn-primary" onClick={fetchTrackingInfo}>🔍 Sprawdź status</button>

            {error && <p className="text-danger mt-2">{error}</p>}

            {trackingData && (
                <div className="mt-3">
                    <h4>Status paczki: {trackingData.status}</h4>
                    <p>📅 Data zamówienia: {new Date(trackingData.orderDate).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default Tracking;
