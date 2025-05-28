import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import ProductModal from './ProductModal';
import { supabase } from '../lib/supabaseClient';

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const { id, name, description, image, featured, is_new } = product;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchInventory();
  }, [id]);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', id);
      
      if (error) {
        console.error('Erro ao buscar estoque:', error);
        return;
      }

      if (data) {
        setInventory(data);
      }
    } catch (err) {
      console.error('Erro ao buscar estoque:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAnyStock = () => {
    return inventory.some(item => item.available_quantity > 0);
  };

  const handleCardClick = () => {
    if (hasAnyStock()) {
      setIsModalOpen(true);
    }
  };
  
  const getLowestPrice = () => {
    if (!inventory || inventory.length === 0) return null;
    const validPrices = inventory
      .map(item => parseFloat(item.price))
      .filter(price => !isNaN(price) && price > 0);
    return validPrices.length > 0 ? Math.min(...validPrices) : null;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className={`bg-white rounded-lg shadow-md overflow-hidden ${hasAnyStock() ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'opacity-50'}`}
        onClick={handleCardClick}
      >
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
          />
          {is_new && (
            <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
              Novo
            </span>
          )}
          {featured && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Destaque
            </span>
          )}
          {!hasAnyStock() && (
            <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              Indisponível
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-heading text-lg font-semibold mb-2">{name}</h3>
          <p className="text-warm-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-warm-gray-500">A partir de</span>
              <p className="text-primary font-semibold">
                {isLoading ? (
                  <span className="text-warm-gray-400">Carregando...</span>
                ) : getLowestPrice() !== null ? (
                  `R$ ${getLowestPrice()?.toFixed(2)}`
                ) : (
                  <span className="text-warm-gray-400">Indisponível</span>
                )}
              </p>
            </div>
            <div className={`${hasAnyStock() ? 'bg-primary/10 hover:bg-primary/20' : 'bg-warm-gray-100'} text-primary rounded-full p-2 transition-colors`}>
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;