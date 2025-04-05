import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminStats from "./pages/AdminStats";
import Navbar from "./components/Navbar";
import AdminPromotions from "./pages/AdminPromotions";
import AdminCategories from "./pages/AdminCategories";
import Tracking from "./pages/Tracking";
//  Funkcja zabezpieczająca dostęp do panelu admina
const ProtectedRoute = ({ children }) => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    return isAdmin ? children : <Navigate to="/admin/login" />;
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* 📌 Główne trasy */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/tracking" element={<Tracking />} />
                
                

                {/* 📌 Logowanie administratora */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* 📌 Trasy dla panelu admina (chronione) */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                    <ProtectedRoute>
                        <AdminProducts />
                    </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                    <ProtectedRoute>
                        <AdminOrders />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute>
                        <AdminUsers />
                    </ProtectedRoute>
                } />
                <Route path="/admin/stats" element={
                    <ProtectedRoute>
                        <AdminStats />
                    </ProtectedRoute>
                } />
               <Route path ="admin/categories" element ={
                <ProtectedRoute>
                    <AdminCategories/>
                </ProtectedRoute>
               }/>
                <Route path = "/admin/promotions"element={
                        <ProtectedRoute>
                            <AdminPromotions/>
                        </ProtectedRoute>
                }/>
            </Routes>
        </Router>
    );
};

export default App;
