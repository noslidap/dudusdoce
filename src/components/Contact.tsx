import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = '5511961729140';
    const message = 'Olá! Gostaria de fazer um pedido no Dudu\'s Sweet Dessert.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Fale Conosco</h2>
          <p className="text-warm-gray-600 max-w-2xl mx-auto">
            Estamos sempre à disposição para atender você. Entre em contato por um dos nossos canais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading text-2xl font-semibold mb-6">Informações de Contato</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Telefone</h4>
                  <p className="text-warm-gray-700">(011) 96172-9140</p>
                  <p className="text-warm-gray-500 text-sm">Atendimento de seg. a sáb. das 9h às 18h</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">E-mail</h4>
                  <p className="text-warm-gray-700">contato@dudussweetdessert.com.br</p>
                  <p className="text-warm-gray-500 text-sm">Respondemos em até 24 horas</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Endereço</h4>
                  <p className="text-warm-gray-700">São Paulo, SP - Brasil</p>
                  <p className="text-warm-gray-500 text-sm">Entregamos em toda a região metropolitana</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Clock className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Horário de Funcionamento</h4>
                  <p className="text-warm-gray-700">Segunda a Sexta: 10h às 20h</p>
                  <p className="text-warm-gray-700">Sábado: 9h às 18h</p>
                  <p className="text-warm-gray-700">Domingo: 12h às 16h</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="font-heading text-2xl font-semibold mb-6">Fazer Pedido</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center group"
                >
                  <Send size={20} className="mr-2" />
                  Pedir pelo WhatsApp
                </button>
                
                <p className="text-center text-warm-gray-500 text-sm">
                  Clique para fazer seu pedido diretamente pelo WhatsApp
                </p>
              </form>
            </div>

            <div className="mt-8 bg-primary/10 rounded-lg p-6">
              <h4 className="font-heading text-xl font-semibold mb-4">Entrega</h4>
              <p className="text-warm-gray-700">
                Entregamos em toda a região metropolitana de São Paulo. Faça seu pedido com pelo menos 24 horas de antecedência para garantir disponibilidade.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;