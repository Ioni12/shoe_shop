import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import ProductForm from "./pages/admin/ProductForm";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import OrderDetail from "./pages/admin/OrderDetail";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-body">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/* Admin login — public, no guard */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin — guarded */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/products" element={<ProductsAdmin />} />
                <Route path="/admin/products/new" element={<ProductForm />} />
                <Route
                  path="/admin/products/:id/edit"
                  element={<ProductForm />}
                />
                <Route path="/admin/orders" element={<OrdersAdmin />} />
                <Route path="/admin/orders/:id" element={<OrderDetail />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
