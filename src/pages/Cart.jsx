import React, { useEffect, useState } from "react";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });
    const [orderMessage, setOrderMessage] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [postalCodeError, setPostalCodeError] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isPercentage, setIsPercentage] = useState(false);
    const [promoError, setPromoError] = useState("");

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    // 📌 Obsługa zmian w formularzu użytkownika
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const phonePattern = /^[0-9]{9}$/;
            setPhoneError(phonePattern.test(value) ? "" : "⚠️ Numer telefonu musi mieć dokładnie 9 cyfr.");
        }

        if (name === "postalCode") {
            const postalPattern = /^[0-9]{2}-[0-9]{3}$/;
            setPostalCodeError(postalPattern.test(value) ? "" : "⚠️ Kod pocztowy musi mieć format XX-XXX.");
        }

        setUserDetails({ ...userDetails, [name]: value });
    };

    //  Aktualizacja ilości produktu w koszyku
    const updateQuantity = (index, quantity) => {
        if (quantity < 1) return;
        const updatedCart = [...cartItems];
        updatedCart[index].quantity = quantity;
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    //  Usuwanie produktu z koszyka
    const removeFromCart = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    //  Opróżnianie koszyka
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
    };

    //  Obliczanie całkowitej kwoty
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalAmount = isPercentage ? totalAmount * (1 - discount / 100) : totalAmount - discount;

    //  Sprawdzanie kodu rabatowego
    const applyPromoCode = async () => {
        try {
            const response = await fetch("http://localhost:5000/promotions/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: promoCode, orderValue: totalAmount })
            });

            const data = await response.json();
            if (response.ok) {
                setDiscount(data.discount);
                setIsPercentage(data.isPercentage);
                setPromoError("");
            } else {
                setPromoError(data.error);
                setDiscount(0);
            }
        } catch (err) {
            console.error("⛔ Błąd walidacji kodu rabatowego:", err);
            setPromoError("⛔ Wystąpił problem, spróbuj ponownie.");
        }
    };

    // Składanie zamówienia
    const placeOrder = async () => {
        if (cartItems.length === 0) {
            alert("⚠️ Koszyk jest pusty!");
            return;
        }

        for (const key in userDetails) {
            if (!userDetails[key]) {
                alert(`⚠️ Proszę uzupełnić pole: ${key}`);
                return;
            }
        }

        if (phoneError || postalCodeError) {
            alert("⚠️ Popraw błędy w formularzu.");
            return;
        }

        const orderData = {
            userId: 1,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phone: userDetails.phone,
            address: userDetails.address,
            city: userDetails.city,
            postalCode: userDetails.postalCode,
            discount: discount,
            finalAmount: finalAmount.toFixed(2),
            products: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const response = await fetch("http://localhost:5000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            if (response.ok) {
                setOrderMessage(`✅ Zamówienie złożone! ID: ${data.orderId} 📦 Twoja paczka powinna dotrzeć w ciągu 2-5 dni roboczych.`);
                clearCart();
            } else {
                alert(`⛔ Błąd: ${data.error}`);
            }
        } catch (err) {
            console.error("⛔ Błąd składania zamówienia:", err);
            alert("⛔ Wystąpił problem z zamówieniem.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>🛒 Twój koszyk</h2>
            {cartItems.length === 0 ? (
                <p>⚠️ Koszyk jest pusty!</p>
            ) : (
                <div>
                    <ul className="list-group">
                        {cartItems.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{item.name} - {item.quantity} szt. - {item.price.toFixed(2)} zł</span>
                                <div>
                                    <input
                                        type="number"
                                        className="form-control d-inline-block w-25"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                    />
                                    <button className="btn btn-danger btn-sm ms-2" onClick={() => removeFromCart(index)}>❌ Usuń</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/*  Kod rabatowy */}
                    <div className="mt-3">
                        <h4>🎟️ Kod rabatowy</h4>
                        <input type="text" className="form-control" placeholder="Wpisz kod rabatowy" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                        <button className="btn btn-primary mt-2" onClick={applyPromoCode}>Zastosuj kod</button>
                        {promoError && <p className="text-danger mt-2">{promoError}</p>}
                    </div>

                    <h4 className="mt-3">💰 Całkowita kwota: <strong>{totalAmount.toFixed(2)} zł</strong></h4>
                    {discount > 0 && <h5 className="text-success">🤑 Rabat: {isPercentage ? `${discount}%` : `${discount.toFixed(2)} zł`} </h5>}
                    <h4>🛍️ Do zapłaty: <strong>{finalAmount.toFixed(2)} zł</strong></h4>

                    {/*  Formularz zamówienia */}
                    <div className="mt-3">
                        <h4>📝 Dane do zamówienia:</h4>
                        <input type="text" className="form-control mb-2" placeholder="Imię" name="firstName" value={userDetails.firstName} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="Nazwisko" name="lastName" value={userDetails.lastName} onChange={handleChange} />
                        <input type="email" className="form-control mb-2" placeholder="Email" name="email" value={userDetails.email} onChange={handleChange} />
                        <textarea className="form-control mb-2" placeholder="Adres dostawy" name="address" value={userDetails.address} onChange={handleChange}></textarea>
                        <input type="text" className="form-control mb-2" placeholder="Telefon (9 cyfr)" name="phone" value={userDetails.phone} onChange={handleChange} />
                        {phoneError && <small className="text-danger">{phoneError}</small>}
                        <input type="text" className="form-control mb-2" placeholder="Miasto" name="city" value={userDetails.city} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="Kod pocztowy (XX-XXX)" name="postalCode" value={userDetails.postalCode} onChange={handleChange} />
                        {postalCodeError && <small className="text-danger">{postalCodeError}</small>}

                    </div>
                    <button className="btn btn-success mt-3" onClick={placeOrder}>🛍️ Złóż zamówienie</button>
                    <button className="btn btn-warning mt-3 ms-2" onClick={clearCart}>🗑️ Wyczyść koszyk</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
