import React from 'react';
import { Size } from '../types';
import { sizes } from '../data/products';

interface SizeSelectorProps {
  selectedSize: Size | '';
  onChange: (size: Size) => void;
  inventory?: any[];
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSize, onChange, inventory = [] }) => {
  const getAvailableQuantity = (size: Size) => {
    const inventoryItem = inventory.find(item => item.size === size);
    return inventoryItem ? inventoryItem.available_quantity : 0;
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">Tamanho:</h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {sizes.map((size) => {
          const [name, volume] = size.label.split(' ');
          const availableQuantity = getAvailableQuantity(size.value as Size);
          const isOutOfStock = availableQuantity === 0;

          return (
            <button
              key={size.value}
              onClick={() => onChange(size.value as Size)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                selectedSize === size.value
                  ? 'bg-primary/10 border-2 border-primary text-primary'
                  : isOutOfStock
                  ? 'bg-warm-gray-100 border-2 border-transparent hover:border-warm-gray-300'
                  : 'bg-warm-gray-50 border-2 border-transparent hover:border-primary/30'
              }`}
            >
              <span className="text-sm font-medium whitespace-nowrap">{name}</span>
              <span className="text-xs text-warm-gray-500 mt-1 whitespace-nowrap">
                {size.value}
              </span>
              {isOutOfStock && (
                <span className="text-xs text-red-500 mt-1">
                  Indisponível
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;