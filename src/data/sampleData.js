// Sample product categories
export const categories = [
  'Pins',
  'Totebags',
];

const basePath = `${import.meta.env.BASE_URL}images/products/`;

// Sample products data
export const products = [
  {
    id: '1',
    title: 'Temple of Philae Pin',
    description: 'Temple of Philae Pin – Detalle arqueológico en esmalte, para amantes de la historia y diseño clásico',
    price: 35000.00,
    category: 'Pins',
    condition: 'Nuevo',
    sellerId: '2',
    sellerName: 'Jane Smith',
    imageUrl:  `${basePath}pin1.jpg`,
    createdAt: '2023-03-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Zurich Pavilion Pin',
    description: 'Pin Zurich Pavilion – Diseño moderno esmaltado, ideal para amantes de la arquitectura.',
    price: 35000.00,
    category: 'Pins',
    condition: 'Edición limitada',
    sellerId: '3',
    sellerName: 'Mike Johnson',
    imageUrl: `${basePath}pin2.jpg`,
    createdAt: '2023-03-16T11:00:00Z'
  },
  {
    id: '3',
    title: 'Casa Batlló Pin',
    description: 'Casa Batlló Pin – Gaudí en miniatura, arte modernista para llevar.',
    price: 35000.00,
    category: 'Pins',
    condition: 'Edición limitada',
    sellerId: '4',
    sellerName: 'Sarah Williams',
    imageUrl: `${basePath}pin3.jpg`,
    createdAt: '2023-03-17T12:15:00Z'
  },
  {
    id: '4',
    title: 'Totebag Templo Egipcio',
    description: 'Totebag Templo Egipcio – Diseño arqueológico elegante, ideal para llevar historia con estilo.',
    price: 50000.00,
    category: 'Totebags',
    condition: 'Unico',
    sellerId: '2',
    sellerName: 'Jane Smith',
    imageUrl: `${basePath}bolsa1.jpg`,
    createdAt: '2023-03-18T13:45:00Z'
  },
  {
    id: '5',
    title: 'Totebag Zurich Pavilion',
    description: 'Totebag Templo Egipcio – Totebag Zurich Pavilion – Estilo moderno y geométrico, perfecto para fans de la arquitectura contemporánea.',
    price: 50000.00,
    category: 'Totebags',
    condition: 'Unico',
    sellerId: '2',
    sellerName: 'Jane Smith',
    imageUrl: `${basePath}bolsa2.jpg`,
    createdAt: '2023-03-18T13:45:00Z'
  },
  {
    id: '6',
    title: 'Totebag Casa Batlló',
    description: 'Totebag Casa Batlló – Arte modernista en cada trazo, perfecta para los amantes de Gaudí y la creatividad sin reglas.',
    price: 50000.00,
    category: 'Totebags',
    condition: 'Nuevo',
    sellerId: '2',
    sellerName: 'Jane Smith',
    imageUrl: `${basePath}bolsa3.jpg`,
    createdAt: '2023-03-18T13:45:00Z'
  }
];

// Sample users data
export const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@archpins.com',
    password: 'admin123', // In a real app, this would be hashed
    isAdmin: true,
    createdAt: '2023-03-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@my.utsa.edu',
    password: 'password123', // In a real app, this would be hashed
    isAdmin: false,
    createdAt: '2023-03-10T08:45:00Z'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@my.utsa.edu',
    password: 'password123', // In a real app, this would be hashed
    isAdmin: false,
    createdAt: '2023-03-11T09:30:00Z'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@my.utsa.edu',
    password: 'password123', // In a real app, this would be hashed
    isAdmin: false,
    createdAt: '2023-03-12T10:15:00Z'
  }
];

// Sample orders data
export const orders = [
  {
    id: '1',
    buyerId: '2',
    buyerName: 'Jane Smith',
    sellerId: '3',
    sellerName: 'Mike Johnson',
    productId: '2',
    productTitle: 'Zurich Pavilion Pin',
    price: 45000.00,
    status: 'completed',
    createdAt: '2023-03-25T15:30:00Z',
    completedAt: '2023-03-27T14:20:00Z'
  },
  {
    id: '2',
    buyerId: '3',
    buyerName: 'Mike Johnson',
    sellerId: '4',
    sellerName: 'Sarah Williams',
    productId: '3',
    productTitle: 'Casa Batlló Pin',
    price: 30000.00,
    status: 'pending',
    createdAt: '2023-03-26T10:45:00Z'
  },
  {
    id: '3',
    buyerId: '4',
    buyerName: 'Sarah Williams',
    sellerId: '2',
    sellerName: 'Jane Smith',
    productId: '4',
    productTitle: 'Totebag Templo Egipcio',
    price: 25000.00,
    status: 'completed',
    createdAt: '2023-03-27T09:15:00Z',
    completedAt: '2023-03-28T16:40:00Z'
  }
];

// Sample sells data
export const sells = [
  {
    id: '1',
    name: 'Pins',
    type: 'percent',
    amount: 15,
    scope: 'category',
    createdAt: '2024-04-01T12:00:00Z'
  },
  {
    id: '2',
    name: 'Totebag Templo Egipcio ',
    type: 'fixed',
    amount: 10,
    scope: 'product',
    createdAt: '2024-04-02T15:30:00Z'
  },
  {
    id: '3',
    name: 'Totebag',
    type: 'percent',
    amount: 20,
    scope: 'category',
    createdAt: '2024-04-05T09:15:00Z'
  }
];

// Sample discounts data
export const discounts = [
  {
    id: "1",
    code: "ARCHPINS10",
    amount: 10, // as percent
    type: "percent",// support both types
    active: true,
    createdAt: "2024-04-22T12:00:00Z"
  },
  {
    id: '2',
    code: 'BIENVENIDO10',
    amount: 5000.00, // flat amount
    type: 'fixed',
    active: true,
    createdAt: "2024-04-22T12:00:00Z"
  }
];

// Sample questions data
export const questions = [
  {
    id: '1',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    question: 'How do I cancel an order that I placed by mistake?',
    category: 'Orders',
    status: 'pending',
    createdAt: '2023-04-01T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    question: 'Is there a way to contact a seller before placing an order?',
    category: 'General',
    status: 'answered',
    createdAt: '2023-04-02T15:45:00Z'
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john@example.com',
    question: 'How long does it typically take for a seller to respond to a purchase request?',
    category: 'Shopping',
    status: 'pending',
    createdAt: '2023-04-03T09:15:00Z'
  }
];

// Export all sample data
export default {
  discounts,
  categories,
  products,
  users,
  orders,
  questions,
  sells
}; 