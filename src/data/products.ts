import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'traditional',
    name: 'Pudim Tradicional',
    description: 'Nosso clássico pudim de leite condensado, suave e com calda caramelizada perfeita.',
    image: 'https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 8.00,
      '120ml': 10.00,
      '250ml': 18.50,
      '500ml': 35.00,
      '1000ml': 69.50
    },
    featured: true
  },
  {
    id: 'chocolate',
    name: 'Pudim de Chocolate',
    description: 'Irresistível pudim de chocolate cremoso, coberto com calda de chocolate.',
    image: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 9.00,
      '120ml': 12.50,
      '250ml': 22.90,
      '500ml': 41.00,
      '1000ml': 69.50
    }
  },
  {
    id: 'brigadeiro',
    name: 'Pudim de Brigadeiro',
    description: 'A combinação perfeita do nosso pudim com o sabor do tradicional brigadeiro brasileiro.',
    image: 'https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 9.50,
      '120ml': 13.00,
      '250ml': 24.00,
      '500ml': 43.00,
      '1000ml': 72.00
    }
  },
  {
    id: 'doce-de-leite',
    name: 'Pudim de Doce de Leite',
    description: 'Pudim com o sabor intenso e caramelizado do autêntico doce de leite.',
    image: 'https://images.pexels.com/photos/5702773/pexels-photo-5702773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 9.50,
      '120ml': 13.00,
      '250ml': 24.00,
      '500ml': 43.00,
      '1000ml': 72.00
    }
  },
  {
    id: 'pacoca',
    name: 'Pudim de Paçoca',
    description: 'Delicioso pudim com o sabor inconfundível da paçoca brasileira.',
    image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 9.50,
      '120ml': 13.00,
      '250ml': 24.00,
      '500ml': 43.00,
      '1000ml': 72.00
    }
  },
  {
    id: 'chocolate-branco',
    name: 'Pudim de Chocolate Branco',
    description: 'Pudim de chocolate branco, suave e sofisticado.',
    image: 'https://images.pexels.com/photos/2693448/pexels-photo-2693448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 9.50,
      '120ml': 13.00,
      '250ml': 24.00,
      '500ml': 43.00,
      '1000ml': 72.00
    }
  },
  {
    id: 'chocolate-suico',
    name: 'Pudim de Chocolate Suíço',
    description: 'Pudim especial inspirado no chocolate suíço, com textura extra cremosa.',
    image: 'https://images.pexels.com/photos/2680603/pexels-photo-2680603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 11.50,
      '120ml': 14.90,
      '250ml': 26.90,
      '500ml': 45.00,
      '1000ml': 82.50
    },
    isNew: true
  },
  {
    id: 'ninho-nutella',
    name: 'Pudim Ninho com Nutella',
    description: 'A combinação irresistível do leite Ninho com Nutella em um pudim cremoso.',
    image: 'https://images.pexels.com/photos/4553127/pexels-photo-4553127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 12.90,
      '120ml': 14.90,
      '250ml': 26.90,
      '500ml': 47.00,
      '1000ml': 85.00
    },
    featured: true
  },
  {
    id: 'pistache',
    name: 'Pudim de Pistache',
    description: 'Pudim sofisticado com o sabor único do pistache, finalizado com pistaches picados.',
    image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    prices: {
      '80ml': 12.90,
      '120ml': 14.90,
      '250ml': 26.90,
      '500ml': 47.00,
      '1000ml': 85.00
    },
    isNew: true
  }
];

export const sizes = [
  { value: '80ml', label: 'Individual 80ml' },
  { value: '120ml', label: 'Pequeno 120ml' },
  { value: '250ml', label: 'Médio 250ml' },
  { value: '500ml', label: 'Grande 500ml' },
  { value: '1000ml', label: 'Família 1000ml' }
];