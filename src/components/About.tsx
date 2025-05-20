import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Nossa História</h2>
          <p className="text-warm-gray-600 max-w-2xl mx-auto">
            Conheça mais sobre o Dudu's Sweet Dessert e nossa paixão por criar os melhores pudins artesanais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading text-3xl font-semibold mb-6">Como tudo começou</h3>
            <p className="text-warm-gray-700 mb-4">
              A Dudu's Sweet Dessert nasceu em 2018 a partir de uma antiga receita de família. O que começou como pudins vendidos apenas para amigos e familiares logo se transformou em um negócio completo, graças ao sabor único e à textura perfeita que conquistaram a todos.
            </p>
            <p className="text-warm-gray-700 mb-4">
              Eduardo, o fundador e chef por trás de cada receita, sempre teve uma paixão especial por sobremesas tradicionais brasileiras. Depois de anos aperfeiçoando as receitas, decidiu compartilhar sua arte com mais pessoas.
            </p>
            <p className="text-warm-gray-700">
              Hoje, a Dudu's Sweet Dessert é conhecida por oferecer os melhores pudins artesanais da região, mantendo o mesmo amor e dedicação em cada uma de nossas criações.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src="/src/assets/img/sobre.png"
              alt="Produção artesanal de pudins"
              className="w-full h-auto"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary" size={24} />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-3">Qualidade</h3>
            <p className="text-warm-gray-600">
              Usamos apenas ingredientes frescos e de alta qualidade. Cada pudim é feito com atenção aos detalhes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-primary" size={24} />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-3">Paixão</h3>
            <p className="text-warm-gray-600">
              Cada receita é feita com amor e paixão pela culinária brasileira, respeitando tradições.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-primary" size={24} />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-3">Tradição</h3>
            <p className="text-warm-gray-600">
              Preservamos o método tradicional de preparo, garantindo o sabor autêntico em cada pudim.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;