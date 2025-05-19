import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, delay = 0 }) => {
  const { name, avatar, rating, text } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-medium">{name}</h4>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < rating ? "fill-amber-400 text-amber-400" : "text-warm-gray-300"}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-warm-gray-700 italic">"{text}"</p>
    </motion.div>
  );
};

export default TestimonialCard;