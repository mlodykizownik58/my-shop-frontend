import React, { useEffect, useState } from "react";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOption, setSortOption] = useState("default");
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

    // 📌 Funkcja filtrowania
    useEffect(() => {
        let updatedProducts = [...products];

        if (searchTerm) {
            updatedProducts = updatedProducts.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (minPrice) {
            updatedProducts = updatedProducts.filter((product) => product.price >= parseFloat(minPrice));
        }

        if (maxPrice) {
            updatedProducts = updatedProducts.filter((product) => product.price <= parseFloat(maxPrice));
        }

        if (sortOption === "priceAsc") {
            updatedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "priceDesc") {
            updatedProducts.sort((a, b) => b.price - a.price);
        } else if (sortOption === "nameAsc") {
            updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "nameDesc") {
            updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredProducts(updatedProducts);
    }, [searchTerm, minPrice, maxPrice, sortOption, products]);

    // 📌 Funkcja do ładowania większej liczby produktów
    const loadMoreProducts = () => {
        setVisibleProducts((prev) => prev + 3);
    };

    return (
        <div className="container mt-4">
            <h2>📦 Lista produktów</h2>

            {/* 📌 Sekcja filtrów i sortowania */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Wyszukaj produkt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="💰 Min. cena"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="💰 Max. cena"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <select
                        className="form-control"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="default">Sortowanie</option>
                        <option value="priceAsc">Cena: ⬆️ Rosnąco</option>
                        <option value="priceDesc">Cena: ⬇️ Malejąco</option>
                        <option value="nameAsc">A-Z</option>
                        <option value="nameDesc">Z-A</option>
                    </select>
                </div>
            </div>

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
                    <button className="btn btn-secondary" onClick={loadMoreProducts}>📥 Zobacz więcej</button>
                </div>
            )}
        </div>
    );
};

export default Home;
