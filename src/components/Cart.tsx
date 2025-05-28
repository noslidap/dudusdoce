import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';
import { supabase } from '../lib/supabaseClient';
import { Size } from '../types';

const Cart: React.FC = () => {
  const { items, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useCart();
  const [stockMap, setStockMap] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchStock = async () => {
      const productIds = Array.from(new Set(items.map(item => item.product.id)));
      if (productIds.length === 0) return;
      const { data, error } = await supabase
        .from('inventory')
        .select('product_id, size, available_quantity')
        .in('product_id', productIds);
      if (error) return;
      const map: { [key: string]: number } = {};
      data.forEach((inv: any) => {
        map[`${inv.product_id}-${inv.size}`] = inv.available_quantity;
      });
      setStockMap(map);
    };
    fetchStock();
  }, [items]);

  const total = items.reduce((sum, item) => (
    sum + item.price * item.quantity
  ), 0);

  const handleQuantityChange = (productId: string, size: Size, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size);
    } else {
      updateQuantity(productId, size, newQuantity);
    }
  };

  const handleWhatsAppOrder = () => {
    const message = items.map(item => (
      `*${item.product.name}*\n` +
      `Tamanho: ${item.size}\n` +
      `Quantidade: ${item.quantity}\n` +
      `Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`
    )).join('\n') + `\n*Total: R$ ${total.toFixed(2)}*`;

    const whatsappUrl = `https://wa.me/5511961729140?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-warm-gray-200 flex justify-between items-center">
              <h2 className="font-heading text-xl font-semibold">Seu Carrinho</h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-warm-gray-100 rounded-full transition-colors"
                aria-label="Fechar carrinho"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-warm-gray-500">
                  Seu carrinho está vazio
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="bg-white rounded-lg border border-warm-gray-200 p-4"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-warm-gray-500">Tamanho: {item.size}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity - 1)}
                                className="p-1 hover:bg-warm-gray-100 rounded transition-colors"
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity + 1)}
                                className="p-1 hover:bg-warm-gray-100 rounded transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-warm-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Remover item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-right mt-2 font-medium">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-warm-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total</span>
                  <span className="font-medium text-xl">R$ {total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Finalizar Pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;