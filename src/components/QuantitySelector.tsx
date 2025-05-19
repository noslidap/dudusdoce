import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  min = 1,
  max = 10
}) => {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={decrease}
        disabled={quantity <= min}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          quantity <= min
            ? 'bg-warm-gray-100 text-warm-gray-400'
            : 'bg-warm-gray-200 text-warm-gray-700 hover:bg-warm-gray-300'
        }`}
        aria-label="Diminuir quantidade"
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center font-medium">{quantity}</span>
      <button
        onClick={increase}
        disabled={quantity >= max}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          quantity >= max
            ? 'bg-warm-gray-100 text-warm-gray-400'
            : 'bg-warm-gray-200 text-warm-gray-700 hover:bg-warm-gray-300'
        }`}
        aria-label="Aumentar quantidade"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;