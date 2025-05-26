import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, ShoppingBag, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items, toggleCart } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Início', href: '#' },
    { name: 'Cardápio', href: '#menu' },
    { name: 'Sobre', href: '#about' },
    { name: 'Contato', href: '#contact' },
  ];

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center z-10">
          <Logo className="w-32 h-auto" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-warm-gray-900 hover:text-primary font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/admin"
            className="text-warm-gray-900 hover:text-primary font-medium transition-colors flex items-center"
          >
            <Settings size={20} className="mr-2" />
            Admin
          </Link>
          <button
            onClick={toggleCart}
            className="relative p-2 hover:bg-warm-gray-100 rounded-full transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link
            to="/admin"
            className="p-2 hover:bg-warm-gray-100 rounded-full transition-colors"
          >
            <Settings size={20} />
          </Link>
          <button
            onClick={toggleCart}
            className="relative p-2 hover:bg-warm-gray-100 rounded-full transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="focus:outline-none z-10"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-0 bg-white/95 flex flex-col items-center justify-center space-y-8 transition-all duration-300 ease-in-out transform ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          } md:hidden`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-2xl font-heading font-medium text-warm-gray-900 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar