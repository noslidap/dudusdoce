import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Product, Size } from '../types';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (size: Size, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = React.useState<Size>('250ml');
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    onAddToCart(selectedSize, quantity);
    onClose();
    setQuantity(1);
  };

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

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
                <h3 className="font-heading text-2xl font-semibold mb-2">{product.name}</h3>
                <p className="text-warm-gray-600 mb-6">{product.description}</p>

                <SizeSelector selectedSize={selectedSize} onChange={setSelectedSize} />

                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-2">
                    <span className="block text-sm font-medium">Quantidade:</span>
                    <QuantitySelector
                      quantity={quantity}
                      onChange={setQuantity}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-warm-gray-500">Preço unitário</p>
                    <p className="font-medium text-lg">
                      R$ {product.prices[selectedSize].toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-warm-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total:</span>
                    <span className="font-medium text-xl text-primary">
                      R$ {(product.prices[selectedSize] * quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;