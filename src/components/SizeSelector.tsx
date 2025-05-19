import React from 'react';
import { Size } from '../types';
import { sizes } from '../data/products';

interface SizeSelectorProps {
  selectedSize: Size;
  onChange: (size: Size) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSize, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">Tamanho:</h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {sizes.map((size) => {
          const [name, volume] = size.label.split(' ');
          return (
            <button
              key={size.value}
              onClick={() => onChange(size.value as Size)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                selectedSize === size.value
                  ? 'bg-primary/10 border-2 border-primary text-primary'
                  : 'bg-warm-gray-50 border-2 border-transparent hover:border-primary/30'
              }`}
            >
              <span className="text-sm font-medium whitespace-nowrap">{name}</span>
              <span className="text-xs text-warm-gray-500 mt-1 whitespace-nowrap">
                {size.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;