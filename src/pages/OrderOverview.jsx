import React, { useEffect, useState } from "react";

const OrdersOverview = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    // 📌 Pobieranie zamówień
    const fetchOrders = async () => {
        try {
            const response = await fetch("http://localhost:5000/admin/orders");
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania zamówień:", err);
        }
    };

    // 📌 Pobieranie szczegółów zamówienia
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5000/orderss/details/${orderId}`);
            const data = await response.json();
            setSelectedOrder(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania szczegółów zamówienia:", err);
        }
    };

    // 📌 Filtrowanie zamówień według statusu
    const filteredOrders = filterStatus
        ? orders.filter((order) => order.status === filterStatus)
        : orders;

    return (
        <div className="container mt-5">
            <h2 className="text-center">📦 Przegląd Zamówień</h2>

            {/* 📌 Filtr statusów */}
            <div className="mb-3">
                <label className="form-label">🔍 Filtruj według statusu:</label>
                <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Wszystkie</option>
                    <option value="pending">🕒 Oczekujące</option>
                    <option value="in progress">🔨 W realizacji</option>
                    <option value="shipped">🚚 Wysłane</option>
                    <option value="completed">✅ Zrealizowane</option>
                    <option value="canceled">❌ Anulowane</option>
                </select>
            </div>

            {/* 📌 Lista zamówień */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Użytkownik</th>
                            <th>Data</th>
                            <th>Kwota</th>
                            <th>Status</th>
                            <th>🛠️ Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.userId}</td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                                <td>{order.totalAmount.toFixed(2)} zł</td>
                                <td>
                                    <span className={`badge bg-${order.status === "completed" ? "success" : order.status === "shipped" ? "primary" : order.status === "canceled" ? "danger" : "warning"}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-info btn-sm" onClick={() => fetchOrderDetails(order.id)}>👁 Podgląd</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 📌 Szczegóły zamówienia */}
            {selectedOrder && (
                <div className="card shadow-lg p-4 mt-4">
                    <h4>📝 Szczegóły zamówienia #{selectedOrder[0]?.orderId}</h4>
                    <p><strong>Użytkownik:</strong> {selectedOrder[0]?.userId}</p>
                    <p><strong>Status:</strong> {selectedOrder[0]?.status}</p>

                    {/* 📌 Lista produktów */}
                    <h5>🛍 Produkty:</h5>
                    <ul className="list-group">
                        {selectedOrder.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between">
                                {item.name} - {item.quantity}x {item.price.toFixed(2)} zł
                            </li>
                        ))}
                    </ul>

                    <button className="btn btn-secondary mt-3" onClick={() => setSelectedOrder(null)}>🔙 Zamknij podgląd</button>
                </div>
            )}
        </div>
    );
};

export default OrdersOverview;
