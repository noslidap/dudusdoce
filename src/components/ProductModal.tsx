import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Product, Size } from '../types';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { addToCart, getItemQuantity } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | ''>('');
  const [quantity, setQuantity] = useState(0);
  const [inventory, setInventory] = useState<Record<Size, { available_quantity: number; price: number }>>({
    '80ml': { available_quantity: 0, price: 0 },
    '120ml': { available_quantity: 0, price: 0 },
    '250ml': { available_quantity: 0, price: 0 },
    '500ml': { available_quantity: 0, price: 0 },
    '1000ml': { available_quantity: 0, price: 0 }
  });

  useEffect(() => {
    fetchInventory();
  }, [product.id]);

  useEffect(() => {
    if (isOpen) {
      setSelectedSize('');
      setQuantity(0);
    }
  }, [isOpen]);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', product.id);

      if (error) throw error;

      const inventoryMap = data.reduce((acc, item) => ({
        ...acc,
        [item.size]: {
          available_quantity: item.available_quantity,
          price: item.price
        }
      }), {} as Record<Size, { available_quantity: number; price: number }>);

      setInventory(inventoryMap);
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
    }
  };

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);
    setQuantity(0);
  };

  const handleQuantityChange = (value: number) => {
    if (selectedSize) {
      const inventoryItem = inventory[selectedSize];
      const maxQuantity = inventoryItem ? inventoryItem.available_quantity : 0;
      setQuantity(Math.min(Math.max(0, value), maxQuantity));
    }
  };

  const getAvailableQuantity = (size: Size) => {
    if (!size || !inventory[size]) return 0;
    const currentStock = inventory[size].available_quantity;
    const quantityInCart = getItemQuantity(product.id, size);
    return currentStock - quantityInCart;
  };

  const getPrice = () => {
    if (!selectedSize || !inventory[selectedSize]) return 0;
    return inventory[selectedSize].price;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor, selecione um tamanho');
      return;
    }

    if (quantity === 0) {
      toast.error('Por favor, selecione uma quantidade');
      return;
    }

    const currentStock = inventory[selectedSize].available_quantity;
    const quantityInCart = getItemQuantity(product.id, selectedSize);
    const availableStock = currentStock - quantityInCart;

    if (quantity > availableStock) {
      toast.error(`Desculpe, só temos ${availableStock} unidades disponíveis`);
      return;
    }

    addToCart(product, selectedSize, quantity, getPrice());
    toast.success('Produto adicionado ao carrinho!');
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Atualizar quantidade quando mudar o tamanho
  useEffect(() => {
    if (selectedSize) {
      const available = getAvailableQuantity(selectedSize);
      setQuantity(available > 0 ? 1 : 0);
    }
  }, [selectedSize]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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

                <span className="block text-sm font-medium mb-2">Tamanho:</span>
                <SizeSelector 
                  sizes={Object.keys(inventory) as Size[]}
                  selectedSize={selectedSize} 
                  onSelect={handleSizeChange}
                  getAvailableQuantity={getAvailableQuantity}
                />

                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-2">
                    <span className="block text-sm font-medium">Quantidade:</span>
                    <QuantitySelector
                      quantity={quantity}
                      onChange={handleQuantityChange}
                      max={selectedSize ? getAvailableQuantity(selectedSize) : 0}
                    />
                    <span className={`block text-xs mt-1 ${selectedSize && getAvailableQuantity(selectedSize) === 0 ? 'text-red-300' : 'text-warm-gray-500'}`}>
                      {selectedSize && getAvailableQuantity(selectedSize) > 0
                        ? `Estoque disponível: ${getAvailableQuantity(selectedSize)} unidade(s)`
                        : selectedSize && getAvailableQuantity(selectedSize) === 0
                          ? (() => {
                              const currentStock = inventory[selectedSize]?.available_quantity || 0;
                              const quantityInCart = getItemQuantity(product.id, selectedSize);
                              if (currentStock > 0 && quantityInCart >= currentStock) {
                                return 'Produto indisponível neste tamanho, quantidade máxima já adicionada ao carrinho';
                              }
                              return 'Produto indisponível neste tamanho';
                            })()
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
                  disabled={!selectedSize || getAvailableQuantity(selectedSize) === 0 || getAvailableQuantity(selectedSize) < quantity}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  {!selectedSize 
                    ? 'Selecione um tamanho'
                    : getAvailableQuantity(selectedSize) === 0
                    ? 'Produto Indisponível'
                    : getAvailableQuantity(selectedSize) < quantity 
                      ? 'Quantidade Indisponível'
                      : 'Adicionar ao Carrinho'
                  }
                </button>

                {selectedSize && getAvailableQuantity(selectedSize) < quantity && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    Quantidade disponível: {getAvailableQuantity(selectedSize)}
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