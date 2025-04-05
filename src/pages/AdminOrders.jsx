import React, { useEffect, useState } from "react";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    // 📌 Pobieranie wszystkich zamówień
    const fetchOrders = async () => {
        try {
            const response = await fetch("http://localhost:5000/orders");
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania zamówień:", err);
        }
    };

    // 📌 Pobieranie szczegółów zamówienia (produkty)
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5000/orders/${orderId}`);
            const data = await response.json();

            if (data.items.length > 0) {
                setOrderDetails((prevDetails) => ({
                    ...prevDetails,
                    [orderId]: data.items,
                }));
            } else {
                setOrderDetails((prevDetails) => ({
                    ...prevDetails,
                    [orderId]: [{ name: "", quantity: "", price: "" }],
                }));
            }
        } catch (err) {
            console.error("⛔ Błąd pobierania szczegółów zamówienia:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">📦 Zarządzanie zamówieniami</h2>
            <table className="table table-bordered text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Numer ID</th>
                        <th>Imię i nazwisko</th>
                        <th>Adres</th>
                        <th>Miasto</th>
                        <th>Kod Pocztowy</th>
                        <th>Data zamówienia</th>
                        <th>Produkty</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <React.Fragment key={order.id}>
                            <tr>
                                <td>{order.id}</td>
                                <td>{order.firstName} {order.lastName}</td>
                                <td>{order.address}</td>
                                <td>{order.city}</td>
                                <td>{order.postalCode}</td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                                <td>
                                    {orderDetails[order.id] ? (
                                        <ul className="list-group">
                                            {orderDetails[order.id].map((item, index) => (
                                                <li key={index} className="list-group-item">
                                                    {item.name} - {item.quantity} szt. - {item.price ? `${item.price.toFixed(2)} zł` : "Brak ceny"}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => fetchOrderDetails(order.id)}
                                        >
                                            🔍 Pokaż produkty
                                        </button>
                                    )}
                                </td>
                                <td>{order.status}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;