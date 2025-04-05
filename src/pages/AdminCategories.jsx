import React, { useEffect, useState } from "react";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

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

    // 📌 Pobieranie wszystkich produktów
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/products");
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania produktów:", err);
        }
    };

    // 📌 Pobieranie produktów przypisanych do wybranej kategorii
    const fetchCategoryProducts = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:5000/categories/${categoryId}/products`);
            if (!response.ok) throw new Error("Błąd pobierania produktów.");
            
            const data = await response.json();
            setCategoryProducts(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania produktów dla kategorii:", err);
            setCategoryProducts([]);
        }
    };

    // 📌 Dodawanie kategorii
    const addCategory = async () => {
        if (!newCategory.trim()) return alert("⚠️ Podaj nazwę kategorii!");

        try {
            const response = await fetch("http://localhost:5000/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory }),
            });

            if (response.ok) {
                alert("✅ Kategoria dodana!");
                setNewCategory("");
                fetchCategories();
            } else {
                alert("⛔ Błąd dodawania kategorii!");
            }
        } catch (err) {
            console.error("⛔ Błąd dodawania kategorii:", err);
        }
    };

    // 📌 Edycja kategorii
    const updateCategory = async () => {
        if (!editCategoryName.trim()) return alert("⚠️ Podaj nazwę kategorii!");

        try {
            const response = await fetch(`http://localhost:5000/categories/${editingCategory.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editCategoryName }),
            });

            if (response.ok) {
                alert("✅ Kategoria zaktualizowana!");
                setEditingCategory(null);
                fetchCategories();
            } else {
                alert("⛔ Błąd aktualizacji kategorii!");
            }
        } catch (err) {
            console.error("⛔ Błąd aktualizacji kategorii:", err);
        }
    };

    // 📌 Usuwanie kategorii
    const deleteCategory = async (id) => {
        if (!window.confirm("❌ Na pewno usunąć kategorię?")) return;

        try {
            const response = await fetch(`http://localhost:5000/categories/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("✅ Kategoria usunięta!");
                fetchCategories();
                setSelectedCategory(null);
                setCategoryProducts([]);
            } else {
                alert("⛔ Błąd usuwania kategorii!");
            }
        } catch (err) {
            console.error("⛔ Błąd usuwania kategorii:", err);
        }
    };

    // 📌 Przypisywanie produktu do kategorii
    const addProductToCategory = async () => {
        if (!selectedCategory || !selectedProduct) {
            alert("⚠️ Wybierz kategorię i produkt!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/categories/${selectedCategory}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: selectedProduct }),
            });

            if (response.ok) {
                alert("✅ Produkt przypisany do kategorii!");
                fetchCategoryProducts(selectedCategory);
            } else {
                alert("⛔ Błąd przypisywania produktu!");
            }
        } catch (err) {
            console.error("⛔ Błąd przypisywania produktu:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>📂 Zarządzanie kategoriami</h2>

            {/* 📌 Dodawanie kategorii */}
            <input type="text" className="form-control mb-2" placeholder="Dodaj kategorię" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <button className="btn btn-primary mb-3" onClick={addCategory}>➕ Dodaj</button>

            {/* 📌 Lista kategorii */}
            <h4>📌 Istniejące kategorie:</h4>
            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span onClick={() => { setSelectedCategory(category.id); fetchCategoryProducts(category.id); }} style={{ cursor: "pointer" }}>
                            {category.name}
                        </span>
                        <div>
                            <button className="btn btn-warning btn-sm mx-1" onClick={() => { setEditingCategory(category); setEditCategoryName(category.name); }}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(category.id)}>❌</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* 📌 Edycja kategorii */}
            {editingCategory && (
                <div className="mt-3">
                    <h4>✏️ Edytuj kategorię</h4>
                    <input type="text" className="form-control mb-2" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
                    <button className="btn btn-success" onClick={updateCategory}>💾 Zapisz zmiany</button>
                </div>
            )}

            {/* 📌 Przypisywanie produktu do kategorii */}
            {selectedCategory && (
                <div className="mt-4">
                    <h4>🛒 Przypisz produkt do kategorii</h4>
                    <select className="form-control mb-2" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        <option value="">Wybierz produkt...</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>
                    <button className="btn btn-success" onClick={addProductToCategory}>➕ Dodaj do kategorii</button>
                </div>
            )}

            {/* 📌 Lista produktów w kategorii */}
            {selectedCategory && (
                <div className="mt-4">
                    <h4>📦 Produkty w tej kategorii:</h4>
                    <ul className="list-group">
                        {categoryProducts.length > 0 ? (
                            categoryProducts.map((product) => (
                                <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {product.name}
                                </li>
                            ))
                        ) : (
                            <p className="text-center mt-2">❌ Brak produktów w tej kategorii.</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
