import React, { useEffect, useState } from "react";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalImage, setModalImage] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // 📌 Pobieranie produktów
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/products");
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            console.error("⛔ Błąd:", err);
        }
    };

    // 📌 Pobieranie kategorii
    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5000/categories");
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania kategorii:", err);
        }
    };

    // 📌 Filtracja po kategorii
    const filterByCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId === null) {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter((product) => product.categoryId === categoryId));
        }
    };

    // 📌 Filtracja po nazwie i cenie
    useEffect(() => {
        let updatedProducts = selectedCategory
            ? products.filter((product) => product.categoryId === selectedCategory)
            : products;

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
    }, [searchTerm, minPrice, maxPrice, sortOption, selectedCategory, products]);

    // 📌 Funkcja dodająca produkt do koszyka
    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Sprawdzenie, czy produkt już jest w koszyku
        const existingProduct = cart.find((item) => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`✅ Dodano ${product.name} do koszyka!`);
    };

    // 📌 Funkcja otwierająca modal ze zdjęciem
    const openImageModal = (imageUrl) => {
        setModalImage(imageUrl);
    };

    return (
        <div className="container mt-4">
            <h2> Lista produktów</h2>
            <div className="row">
                {/* 📌 Sidebar kategorii */}
                <div className="col-md-3">
                    <h5> Kategorie</h5>
                    <ul className="list-group">
                        <li 
                            className={`list-group-item ${selectedCategory === null ? "active" : ""}`} 
                            onClick={() => filterByCategory(null)}
                            style={{ cursor: "pointer" }}
                        >
                            Wszystkie produkty
                        </li>
                        {categories.map((category) => (
                            <li 
                                key={category.id} 
                                className={`list-group-item ${selectedCategory === category.id ? "active" : ""}`} 
                                onClick={() => filterByCategory(category.id)}
                                style={{ cursor: "pointer" }}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 📌 Sekcja produktów */}
                <div className="col-md-9">
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
                                <option value="priceDesc">Cena:⬆️ Rosnąco </option>
                                <option value="priceAsc">Cena: ⬇️ Malejąco</option>
                                 <option value="nameDesc">A-Z</option>
                                <option value="nameAsc">Z-A</option>
                               
                            </select>
                        </div>
                    </div>

                    {/* 📌 Lista produktów */}
                    <div className="row">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="col-md-4 mb-4">
                                    <div className="card">
                                        {product.imageUrl ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${product.imageUrl}`}
                                                className="card-img-top"
                                                alt={product.name}
                                                style={{ maxHeight: "200px", objectFit: "cover", cursor: "pointer" }}
                                                onClick={() => openImageModal(`http://localhost:5000/uploads/${product.imageUrl}`)}
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
                </div>
            </div>

            {/* 📌 Modal ze zdjęciem */}
            {modalImage && (
                <div className="modal d-block" tabIndex="-1" onClick={() => setModalImage(null)}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body text-center">
                                <img src={modalImage} alt="Produkt" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
