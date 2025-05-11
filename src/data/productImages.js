// Product image categories and paths
const basePath = `${import.meta.env.BASE_URL}images/products/`;

const productImages = {
  electronics: [
    '/images/products/calculator.jpg',
    '/images/products/laptop.jpg',
    '/images/products/headphones.jpg',
    '/images/products/monitor.jpg'
  ],
  books: [
    '/images/products/textbook-chem.jpg',
    '/images/products/textbook-math.jpg',
    '/images/products/textbook-bio.jpg',
    '/images/products/novel.jpg'
  ],
  clothing: [
    '/images/products/hoodie.jpg',
    '/images/products/tshirt.jpg',
    '/images/products/jeans.jpg',
    '/images/products/jacket.jpg'
  ],
  furniture: [
    '/images/products/desk.jpg',
    '/images/products/chair.jpg',
    '/images/products/lamp.jpg', 
    '/images/products/shelf.jpg'
  
  
  ],
  pins: [
    `${basePath}pin1.jpg`,
    `${basePath}pin2.jpg`,
    `${basePath}pin3.jpg`
  ],
  bolsas: [
    `${basePath}bolsa1.jpg`,
    `${basePath}bolsa2.jpg`,
    `${basePath}bolsa3.jpg`
  ],

  'school supplies': [
    '/images/products/backpack.jpg',
    '/images/products/notebooks.jpg',
    '/images/products/pens.jpg',
    '/images/products/organizer.jpg'
  ],
  'dorm essentials': [
    '/images/products/microwave.jpg',
    '/images/products/mini-fridge.jpg',
    '/images/products/coffee-maker.jpg',
    '/images/products/electric-kettle.jpg'
  ],
  default: [
    '/images/products/default1.jpg',
    '/images/products/default2.jpg',
    '/images/products/default3.jpg',
    '/images/products/default4.jpg'
  ]
};

// Get images for a specific category
export const getImagesByCategory = (category) => {
  const lowerCategory = category.toLowerCase();
  return productImages[lowerCategory] || productImages.default;
};

// Get a random image from a category
export const getRandomImageForCategory = (category) => {
  const images = getImagesByCategory(category);
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// Get all available images (flattened array)
export const getAllImages = () => {
  return Object.values(productImages).flat();
};

export default productImages; 