import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen hero-pattern flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center py-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-warm-gray-900 mb-4 leading-tight">
            O Pudim perfeito <span className="text-primary">existe</span> e está aqui!
          </h1>
          <p className="text-warm-gray-700 text-lg mb-8 md:max-w-md">
            Feito com amor, para ser devorado com prazer! Descubra nossos sabores irresistíveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#menu"
              className="btn-primary inline-flex items-center justify-center"
            >
              Ver Cardápio
              <ArrowRight size={18} className="ml-2" />
            </a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-lg mx-auto w-full"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
            <img
              src="/assets/pudim_hero.jpg"
              alt="Pudim Tradicional Dudu's Sweet Dessert"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -bottom-20 -right-6 bg-white p-4 rounded-lg shadow-md max-w-xs hidden md:block"
          >
            <div className="flex items-center mb-2">
              <div className="bg-primary/20 p-2 rounded-full mr-3">
                <Star className="text-primary" size={18} />
              </div>
              <div>
                <p className="font-medium">Mais de 500 avaliações</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-amber-400 text-amber-400" size={14} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-warm-gray-600 text-sm">
              "O melhor pudim que já provei na vida! A textura é perfeita."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;