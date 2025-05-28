import React from 'react';
import { Size } from '../types';

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: Size | '';
  onSelect: (size: Size) => void;
  inventory: Record<Size, { available_quantity: number; price: number }>;
  getAvailableQuantity: (size: Size) => number;
}

const sizeLabels: Record<Size, { label: string; volume: string }> = {
  '80ml': { label: 'Individual', volume: '80ml' },
  '120ml': { label: 'Pequeno', volume: '120ml' },
  '250ml': { label: 'Médio', volume: '250ml' },
  '500ml': { label: 'Grande', volume: '500ml' },
  '1000ml': { label: 'Família', volume: '1000ml' },
};

const sizeOrder: Size[] = ['80ml', '120ml', '250ml', '500ml', '1000ml'];

const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelect,
  inventory,
  getAvailableQuantity
}) => {
  // Ordena os tamanhos na ordem correta
  const orderedSizes = sizeOrder.filter(size => sizes.includes(size));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
      {orderedSizes.map((size) => {
        const availableQuantity = getAvailableQuantity(size);
        const isAvailable = availableQuantity > 0;
        const { label, volume } = sizeLabels[size];
        const isSelected = selectedSize === size;
        return (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`py-3 px-2 rounded-lg border text-center transition-colors flex flex-col items-center justify-center h-auto min-w-0 whitespace-nowrap
              ${isSelected && isAvailable ? 'border-primary bg-primary/10 text-primary' : ''}
              ${!isAvailable && isSelected ? 'border-red-500 bg-red-50 text-red-600' : ''}
              ${!isAvailable && !isSelected ? 'border-red-200 bg-red-50 text-red-400' : ''}
              ${isAvailable && !isSelected ? 'border-warm-gray-200 hover:border-primary hover:text-primary' : ''}
            `}
            style={{ fontSize: '1rem' }}
          >
            <span className={`${isAvailable ? 'font-medium' : 'font-normal'}`}>{label}</span>
            <span className="text-xs text-warm-gray-500">{volume}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SizeSelector;