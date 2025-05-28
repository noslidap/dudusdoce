import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Cart from './components/Cart';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <>
              {!hideNavbar && <Navbar />}
              <main className="flex-grow">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Hero />
                        <Menu />
                        <About />
                        <Contact />
                      </>
                    }
                  />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Cart />
              <FloatingWhatsApp />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="colored" />
      <BrowserRouter>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </BrowserRouter>
    </>
  );
}

export default App;