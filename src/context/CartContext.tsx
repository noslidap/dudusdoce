import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Size } from '../types';

interface CartItem {
  product: Product;
  size: Size;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: Size, quantity: number, price: number) => void;
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

  const addToCart = useCallback((product: Product, size: Size, quantity: number, price: number) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { product, size, quantity, price }];
      }
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
    setItems((prevItems) =>
      prevItems.map((item) =>
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