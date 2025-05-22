import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, BookIcon as TiktokIcon, MapPin, Phone, Mail } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-warm-gray-100 pt-12 pb-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Logo className="mb-4" />
            <p className="text-warm-gray-700 text-center md:text-left mb-4">
              O Pudim perfeito existe e está aqui, feito com amor, para ser devorado com prazer!
            </p>
            <div className="flex space-x-4 mt-2">
              <a 
                href="https://www.instagram.com/dudu.s.sweet.dessert/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-warm-gray-700 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@dudussweetdessert" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-warm-gray-700 hover:text-primary transition-colors"
                aria-label="TikTok"
              >
                <TiktokIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-warm-gray-700 hover:text-primary transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/menu" className="text-warm-gray-700 hover:text-primary transition-colors">Cardápio</Link>
              </li>
              <li>
                <Link to="/about" className="text-warm-gray-700 hover:text-primary transition-colors">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/contact" className="text-warm-gray-700 hover:text-primary transition-colors">Contato</Link>
              </li>
              <li>
                <Link to="/order" className="text-warm-gray-700 hover:text-primary transition-colors">Fazer Pedido</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={18} className="mt-1 mr-2 text-primary" />
                <span>011-96172-9140</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mt-1 mr-2 text-primary" />
                <span>contato@dudussweetdessert.com.br</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 mr-2 text-primary" />
                <span>São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-warm-gray-700">Segunda-Sexta:</span>
                <span className="font-medium">10:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-warm-gray-700">Sábado:</span>
                <span className="font-medium">09:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-warm-gray-700">Domingo:</span>
                <span className="font-medium">12:00 - 16:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-warm-gray-200 mt-10 pt-6">
          <p className="text-center text-warm-gray-600 text-sm">
            © {new Date().getFullYear()} Dudu's Sweet Dessert. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;