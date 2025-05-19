import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

type FilterOption = 'all' | 'new' | 'featured';

const MenuPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'new') return matchesSearch && product.isNew;
    if (activeFilter === 'featured') return matchesSearch && product.featured;
    
    return matchesSearch;
  });

  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-4xl font-bold text-center mb-2">Nosso Cardápio</h1>
          <p className="text-warm-gray-600 text-center mb-12 max-w-xl mx-auto">
            Explore nossa variedade de pudins artesanais, feitos com ingredientes selecionados e muito amor.
          </p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-auto md:flex-grow">
              <input
                type="text"
                placeholder="Buscar pudins..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-warm-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray-400" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={20} className="text-warm-gray-500" />
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveFilter('new')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === 'new'
                      ? 'bg-accent text-white'
                      : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200'
                  }`}
                >
                  Novidades
                </button>
                <button
                  onClick={() => setActiveFilter('featured')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === 'featured'
                      ? 'bg-primary text-white'
                      : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200'
                  }`}
                >
                  Destaques
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index % 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-warm-gray-500 mb-4">Nenhum pudim encontrado com os critérios de busca atuais.</p>
            <button
              onClick={() => {setSearchTerm(''); setActiveFilter('all');}}
              className="btn-outline"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;