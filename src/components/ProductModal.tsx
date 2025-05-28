import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Product, Size } from '../types';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  inventory: any[];
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  inventory
}) => {
  const [selectedSize, setSelectedSize] = useState<Size | ''>('');
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setSelectedSize('');
      setQuantity(0);
    }
  }, [isOpen]);

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);
    setQuantity(0);
  };

  const handleQuantityChange = (value: number) => {
    if (selectedSize) {
      const inventoryItem = inventory.find(item => item.size === selectedSize);
      const maxQuantity = inventoryItem ? inventoryItem.available_quantity : 0;
      setQuantity(Math.min(Math.max(0, value), maxQuantity));
    }
  };

  const getAvailableQuantity = () => {
    if (!selectedSize) return 0;
    const inventoryItem = inventory.find(item => item.size === selectedSize);
    return inventoryItem ? inventoryItem.available_quantity : 0;
  };

  const getPrice = () => {
    if (!selectedSize) return 0;
    const inventoryItem = inventory.find(item => item.size === selectedSize);
    return inventoryItem ? parseFloat(inventoryItem.price) : 0;
  };

  const handleAddToCart = () => {
    if (selectedSize && getAvailableQuantity() >= quantity) {
      addToCart(product, selectedSize, quantity, getPrice());
      onClose();
    }
  };

  // Atualizar quantidade quando mudar o tamanho
  useEffect(() => {
    if (selectedSize) {
      const available = getAvailableQuantity();
      setQuantity(available > 0 ? 1 : 0);
    }
  }, [selectedSize]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-2xl font-semibold mb-2">{product.name}</h3>
                <p className="text-warm-gray-600 mb-6">{product.description}</p>

                <SizeSelector 
                  selectedSize={selectedSize || ''} 
                  onChange={(size) => handleSizeChange(size)}
                  inventory={inventory}
                />

                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-2">
                    <span className="block text-sm font-medium">Quantidade:</span>
                    <QuantitySelector
                      quantity={quantity}
                      onChange={handleQuantityChange}
                      max={getAvailableQuantity()}
                    />
                    <span className="block text-xs text-warm-gray-500 mt-1">
                      {selectedSize && getAvailableQuantity() > 0 
                        ? `Estoque disponível: ${getAvailableQuantity()} unidade(s)`
                        : selectedSize && getAvailableQuantity() === 0
                        ? 'Produto indisponível neste tamanho'
                        : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-warm-gray-500">Preço unitário</p>
                    <p className="font-medium text-lg">
                      R$ {getPrice().toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium text-xl text-primary">
                    R$ {(getPrice() * quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || getAvailableQuantity() === 0 || getAvailableQuantity() < quantity}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  {!selectedSize 
                    ? 'Selecione um tamanho'
                    : getAvailableQuantity() === 0
                    ? 'Produto Indisponível'
                    : getAvailableQuantity() < quantity 
                      ? 'Quantidade Indisponível'
                      : 'Adicionar ao Carrinho'
                  }
                </button>

                {getAvailableQuantity() < quantity && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    Quantidade disponível: {getAvailableQuantity()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;