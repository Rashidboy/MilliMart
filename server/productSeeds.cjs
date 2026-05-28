const PRODUCT_SEEDS = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: "Samsung flagship smartfoni. Snapdragon 8 Gen 3, 200MP kamera va premium titandan korpus.",
    price: 14999000,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'phones',
    stock: 45,
  },
  {
    name: 'iPhone 15 Pro Max',
    description: "Apple'ning premium flagmani. A17 Pro chip, 48MP kamera va titanium frame.",
    price: 17499000,
    discount: 8,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484f3438?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'phones',
    stock: 32,
  },
  {
    name: 'MacBook Pro 16" M3 Pro',
    description: 'M3 Pro chip bilan professional laptop. Liquid Retina XDR va uzoq batareya muddati.',
    price: 25999000,
    discount: 7,
    images: [
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'laptops',
    stock: 15,
  },
];

module.exports = { PRODUCT_SEEDS };
