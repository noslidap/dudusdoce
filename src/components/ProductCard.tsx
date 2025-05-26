import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Award, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';
import { supabase } from '../lib/supabaseClient';

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const { id, name, description, image, featured, isNew } = product;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const [inventory, setInventory] = useState<any[]>([]);
  
  useEffect(() => {
    fetchInventory();
  }, [id]);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', id);
    
    if (!error && data) {
      setInventory(data);
    }
  };
  
  const handleAddToCart = (size: Size, quantity: number) => {
    const inventoryItem = inventory.find(item => item.size === size);
    if (inventoryItem && inventoryItem.available_quantity >= quantity) {
      addToCart(product, size, quantity);
    }
  };

  const getLowestPrice = () => {
    if (inventory.length === 0) return 0;
    return Math.min(...inventory.map(item => item.price));
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        viewport={{ once: true }}
        className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative overflow-hidden h-48">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {featured && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <Award size={14} className="mr-1" />
              Destaque
            </div>
          )}
          {isNew && (
            <div className="absolute top-2 right-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <Star size={14} className="mr-1" />
              Novo
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-heading text-lg font-semibold mb-2">{name}</h3>
          <p className="text-warm-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-warm-gray-500">A partir de</span>
              <p className="text-primary font-semibold">
                R$ {getLowestPrice().toFixed(2)}
              </p>
            </div>
            <div className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full p-2 transition-colors">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      <ProductModal
        product={product}
        inventory={inventory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductCard;