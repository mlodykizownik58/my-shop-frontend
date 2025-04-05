import React, { useEffect, useState } from "react";

const Home = () => {
    const [, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(3);

    useEffect(() => {
        fetch("http://localhost:5000/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch((err) => console.error("⛔ Błąd:", err));
    }, []);

    // 📌 Funkcja dodająca produkt do koszyka
    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`✅ Dodano ${product.name} do koszyka!`);
    };

 

    // 📌 Funkcja do ładowania większej liczby produktów
    const loadMoreProducts = () => {
        setVisibleProducts((prev) => prev + 3);
    };

    return (
        <div className="container mt-4">
            <h2>Strona Główna</h2>

            

            {/* 📌 Lista produktów */}
            <div className="row">
                {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, visibleProducts).map((product) => (
                        <div key={product.id} className="col-md-4 mb-4">
                            <div className="card">
                                {product.imageUrl ? (
                                    <img
                                        src={`http://localhost:5000/uploads/${product.imageUrl}`}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ maxHeight: "200px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <img
                                        src="https://via.placeholder.com/200"
                                        className="card-img-top"
                                        alt="Brak zdjęcia"
                                        style={{ maxHeight: "200px", objectFit: "cover" }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p>{product.description}</p>
                                    <p><strong>{product.price.toFixed(2)} zł</strong></p>
                                    <button className="btn btn-primary" onClick={() => addToCart(product)}>➕ Dodaj do koszyka</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">❌ Brak produktów spełniających kryteria.</p>
                )}
            </div>

            {/* 📌 Przycisk "Zobacz więcej" */}
            {visibleProducts < filteredProducts.length && (
                <div className="text-center mt-3">
                    <button className="btn btn-secondary" onClick={loadMoreProducts}> Zobacz więcej</button>
                </div>
            )}
        </div>
    );
};

export default Home;
