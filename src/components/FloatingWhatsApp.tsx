import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp: React.FC = () => {
  const phoneNumber = '5511961729140'; // Brazilian number format for WhatsApp
  
  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=Olá! Gostaria de fazer um pedido no Dudu's Sweet Dessert.`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center group"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out">
        WhatsApp
      </span>
    </button>
  );
};

export default FloatingWhatsApp;