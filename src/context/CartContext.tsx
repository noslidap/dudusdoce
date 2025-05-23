import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Size } from '../types';

interface CartItem {
  product: Product;
  size: Size;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: Size, quantity: number) => void;
  removeFromCart: (product: Product, size: Size) => void;
  updateQuantity: (product: Product, size: Size, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product: Product, size: Size, quantity: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { product, size, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((product: Product, size: Size) => {
    setItems(currentItems =>
      currentItems.filter(
        item => !(item.product.id === product.id && item.size === size)
      )
    );
  }, []);

  const updateQuantity = useCallback((product: Product, size: Size, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === product.id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};