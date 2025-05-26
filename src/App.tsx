import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Cart from './components/Cart';
import AdminPage from './pages/AdminPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Menu />
                <About />
                <Contact />
              </>
            } />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Cart />
        <FloatingWhatsApp />
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;