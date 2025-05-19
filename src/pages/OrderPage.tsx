import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, MessageSquare } from 'lucide-react';
import { products } from '../data/products';
import { Product, Size } from '../types';
import SizeSelector from '../components/SizeSelector';
import QuantitySelector from '../components/QuantitySelector';

const OrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size>('250ml');
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get('product');
    
    if (productId) {
      const product = products.find(p => p.id === productId) || null;
      setSelectedProduct(product);
    } else if (products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [location]);

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId) || null;
    setSelectedProduct(product);
  };

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);
  };

  const getPrice = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.prices[selectedSize] * quantity;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    // Construct WhatsApp message
    const productName = selectedProduct.name;
    const price = getPrice().toFixed(2);
    const instructions = specialInstructions ? `\nInstruções especiais: ${specialInstructions}` : '';
    
    const message = `Olá! Gostaria de fazer um pedido:\n\n*Produto:* ${productName}\n*Tamanho:* ${selectedSize}\n*Quantidade:* ${quantity}\n*Total:* R$ ${price}${instructions}`;
    
    // Open WhatsApp with pre-filled message
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5511961729140?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-warm-gray-600 hover:text-primary transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Voltar</span>
          </button>
          
          <h1 className="font-heading text-3xl font-bold text-center mt-4 mb-2">Fazer Pedido</h1>
          <p className="text-warm-gray-600 text-center mb-8 max-w-xl mx-auto">
            Escolha seu pudim favorito, selecione o tamanho e quantidade para fazer seu pedido.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                {selectedProduct && (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <h2 className="font-heading text-2xl font-semibold mb-2">
                  {selectedProduct ? selectedProduct.name : 'Selecione um produto'}
                </h2>
                <p className="text-warm-gray-600 mb-6">
                  {selectedProduct ? selectedProduct.description : ''}
                </p>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Escolha o Pudim:</h3>
                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full p-3 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-heading text-2xl font-semibold mb-6 pb-4 border-b border-warm-gray-100">
                Detalhes do Pedido
              </h2>
              
              <form onSubmit={handleSubmit}>
                <SizeSelector selectedSize={selectedSize} onChange={handleSizeChange} />
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Quantidade:</h3>
                  <div className="flex items-center justify-between">
                    <QuantitySelector 
                      quantity={quantity} 
                      onChange={setQuantity}
                    />
                    <div className="text-right">
                      <p className="text-sm text-warm-gray-500 mb-1">Preço unitário</p>
                      <p className="font-medium text-lg">
                        R$ {selectedProduct ? selectedProduct.prices[selectedSize].toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-medium mb-3">Instruções Especiais (opcional):</h3>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Alguma observação para seu pedido? Informe aqui."
                    className="w-full p-3 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  ></textarea>
                </div>
                
                <div className="bg-warm-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-warm-gray-700">Subtotal:</span>
                    <span>R$ {getPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-warm-gray-700">Taxa de entrega:</span>
                    <span>A confirmar</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-warm-gray-200 mt-2">
                    <span className="font-medium">Total:</span>
                    <span className="font-medium text-xl text-primary">R$ {getPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center group"
                >
                  <div className="flex items-center mr-3">
                    <MessageSquare size={20} />
                  </div>
                  <span>Fazer Pedido pelo WhatsApp</span>
                  <ShoppingBag size={20} className="opacity-0 group-hover:opacity-100 ml-2 transition-opacity" />
                </button>
                
                <p className="text-center text-warm-gray-500 text-sm mt-4">
                  Ao clicar em "Fazer Pedido", você será redirecionado para o WhatsApp para finalizar seu pedido.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;