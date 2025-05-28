import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';

type FilterOption = 'all' | 'new' | 'featured';

const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'new') return matchesSearch && product.is_new;
    if (activeFilter === 'featured') return matchesSearch && product.featured;
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <section id="menu" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">Carregando produtos...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nosso Cardápio</h2>
          <p className="text-warm-gray-600">Descubra nossos deliciosos pudins</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar pudins..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-2.5 text-warm-gray-400" size={20} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === 'new'
                  ? 'bg-primary text-white'
                  : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
              }`}
            >
              Novidades
            </button>
            <button
              onClick={() => setActiveFilter('featured')}
              className={`px-4 py-2 rounded-lg ${
                activeFilter === 'featured'
                  ? 'bg-primary text-white'
                  : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
              }`}
            >
              Destaques
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;