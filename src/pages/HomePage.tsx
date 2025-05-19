import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Package, Star, Gift, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';
import { products } from '../data/products';
import { testimonials } from '../data/testimonials';

const HomePage: React.FC = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const featuredProducts = products.filter(product => product.featured);
  
  return (
    <div>
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-screen hero-pattern flex items-center justify-center px-4 pt-20"
      >
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center py-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
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
              <Link
                to="/menu"
                className="btn-primary inline-flex items-center justify-center"
              >
                Ver Cardápio
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/order"
                className="btn-outline inline-flex items-center justify-center"
              >
                Fazer Pedido
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5702773/pexels-photo-5702773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Pudim Tradicional Dudu's Sweet Dessert"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-md max-w-xs hidden md:block"
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">Nossos Destaques</h2>
          <p className="text-center text-warm-gray-600 mb-12 max-w-2xl mx-auto">
            Conheça nossos pudins mais populares, feitos com ingredientes de alta qualidade e muito carinho.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index} />
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center bg-primary/5 rounded-lg p-8 text-center h-full"
            >
              <h3 className="font-heading text-xl font-semibold mb-4">
                Veja Todos os Nossos Sabores
              </h3>
              <p className="text-warm-gray-600 mb-6">
                Descubra nossa variedade completa de pudins artesanais.
              </p>
              <Link 
                to="/menu" 
                className="btn-outline"
              >
                Ver Cardápio Completo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">Por Que Escolher Nossos Pudins?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-primary" size={24} />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Ingredientes Selecionados</h3>
              <p className="text-warm-gray-600">
                Utilizamos apenas ingredientes naturais e de alta qualidade em nossas receitas.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-primary" size={24} />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Entrega Cuidadosa</h3>
              <p className="text-warm-gray-600">
                Embalagens especiais que preservam o sabor e a textura dos nossos pudins.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-primary" size={24} />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Perfeito para Presentes</h3>
              <p className="text-warm-gray-600">
                Surpreenda quem você ama com nossos deliciosos pudins artesanais.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="section-heading">O Que Nossos Clientes Dizem</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} delay={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Pronto para experimentar o melhor pudim?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
            Faça seu pedido agora mesmo e receba em casa nossos deliciosos pudins artesanais.
          </p>
          <Link to="/order" className="bg-white text-primary hover:bg-cream transition-colors px-8 py-3 rounded-full font-medium text-lg inline-flex items-center">
            Fazer Pedido
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;