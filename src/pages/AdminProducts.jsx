import React, { useEffect, useState } from "react";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: ""
    });
    const [image, setImage] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editImage, setEditImage] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    // 📌 Pobieranie listy produktów
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/products");
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("⛔ Błąd pobierania produktów:", err);
        }
    };

    // 📌 Obsługa formularza nowego produktu
    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    // 📌 Obsługa zmiany pliku obrazu
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // 📌 Dodawanie nowego produktu z obrazem
    const addProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            alert("⚠️ Podaj nazwę, cenę i ilość!");
            return;
        }

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("description", newProduct.description);
        formData.append("price", newProduct.price);
        formData.append("stock", newProduct.stock);
        if (image) formData.append("image", image);

        try {
            const response = await fetch("http://localhost:5000/products", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("✅ Produkt dodany!");
                setNewProduct({ name: "", description: "", price: "", stock: "" });
                setImage(null);
                fetchProducts();
            } else {
                alert("⛔ Błąd dodawania produktu!");
            }
        } catch (err) {
            console.error("⛔ Błąd dodawania produktu:", err);
        }
    };

    // 📌 Usuwanie produktu
    const deleteProduct = async (id) => {
        if (!window.confirm("❌ Czy na pewno chcesz usunąć ten produkt?")) return;

        try {
            const response = await fetch(`http://localhost:5000/products/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("✅ Produkt usunięty!");
                fetchProducts();
            } else {
                alert("⛔ Błąd usuwania produktu!");
            }
        } catch (err) {
            console.error("⛔ Błąd usuwania produktu:", err);
        }
    };

    // 📌 Rozpoczęcie edycji produktu
    const startEditing = (product) => {
        setEditingProduct(product);
        setEditImage(null);
    };

    // 📌 Obsługa zmiany edytowanego obrazu
    const handleEditImageChange = (e) => {
        setEditImage(e.target.files[0]);
    };

    // 📌 Zapisanie edytowanych zmian
    const saveChanges = async () => {
        if (!editingProduct) return;

        const formData = new FormData();
        formData.append("name", editingProduct.name);
        formData.append("description", editingProduct.description);
        formData.append("price", editingProduct.price);
        formData.append("stock", editingProduct.stock);
        if (editImage) formData.append("image", editImage);

        try {
            const response = await fetch(`http://localhost:5000/products/${editingProduct.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                alert("✅ Produkt zaktualizowany!");
                setEditingProduct(null);
                setEditImage(null);
                fetchProducts();
            } else {
                alert("⛔ Błąd aktualizacji produktu!");
            }
        } catch (err) {
            console.error("⛔ Błąd aktualizacji produktu:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">🛠️ Panel edycji produktów</h2>
            {/* 📌 Sekcja dodawania nowego produktu */}
            <div className="card shadow-lg p-4 mb-5 bg-white rounded">
                <h4 className="mb-3">➕ Dodaj nowy produkt</h4>
                <div className="row">
                    <div className="col-md-6 mb-2">
                        <input type="text" className="form-control" name="name" placeholder="Nazwa" value={newProduct.name} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-2">
                        <input type="text" className="form-control" name="description" placeholder="Opis" value={newProduct.description} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-2">
                        <input type="number" className="form-control" name="price" placeholder="Cena (zł)" value={newProduct.price} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-2">
                        <input type="number" className="form-control" name="stock" placeholder="Ilość" value={newProduct.stock} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-2">
                        <input type="file" className="form-control" onChange={handleImageChange} />
                    </div>
                    <div className="col-md-12 mb-2 d-flex justify-content-center">
                        <button className="btn btn-success w-50" onClick={addProduct}>➕ Dodaj produkt</button>
                    </div>
                </div>
            </div>

            {/* 📌 Lista produktów */}
            <h4 className="text-center mb-3">📦 Lista produktów</h4>
            <div className="table-responsive">
                <table className="table table-hover table-bordered shadow-sm">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>Zdjęcie</th>
                            <th>Nazwa</th>
                            <th>Opis</th>
                            <th>Cena</th>
                            <th>Ilość</th>
                            <th>🛠️ Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    {product.imageUrl ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${product.imageUrl}`}
                                            alt="Produkt"
                                            width="50"
                                            height="50"
                                            style={{ objectFit: "cover", borderRadius: "5px" }}
                                        />
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/50"
                                            alt="Brak zdjęcia"
                                            width="50"
                                            height="50"
                                            style={{ objectFit: "cover", borderRadius: "5px" }}
                                        />
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price ? `${product.price.toFixed(2)} zł` : "0 zł"}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm mx-1" onClick={() => startEditing(product)}>✏️ Edytuj</button>
                                    <button className="btn btn-danger btn-sm mx-1" onClick={() => deleteProduct(product.id)}>❌ Usuń</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingProduct && (
                <div className="mt-4 card p-4 shadow-lg">
                    <h4>📝 Edytuj produkt: {editingProduct.name}</h4>
                    <label className="mt-2">📌 Nazwa:</label>
                    <input type="text" className="form-control mb-2" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />

                    <label className="mt-2">📝 Opis:</label>
                    <textarea className="form-control mb-2" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />

                    <label className="mt-2">💰 Cena (zł):</label>
                    <input type="number" className="form-control mb-2" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />

                    <label className="mt-2">📦 Ilość:</label>
                    <input type="number" className="form-control mb-2" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />

                    <label className="mt-2">🖼️ Obraz produktu:</label>
                    <input type="file" className="form-control mb-2" onChange={handleEditImageChange} />

                    <button className="btn btn-success mt-3" onClick={saveChanges}>💾 Zapisz zmiany</button>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
