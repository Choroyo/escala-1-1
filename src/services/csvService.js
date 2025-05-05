import Papa from 'papaparse';

// Convert array of objects to CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  return Papa.unparse(data);
};

// Parse CSV to array of objects
const parseCSV = (csv) => {
  if (!csv) return [];
  
  const result = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true
  });
  
  return result.data;
};

// Save data to CSV in localStorage
const saveData = (key, data) => {
  const csv = convertToCSV(data);
  localStorage.setItem(`csv_${key}`, csv);
  return data;
};

// Load data from CSV in localStorage
const loadData = (key, defaultData = []) => {
  const csv = localStorage.getItem(`csv_${key}`);
  return csv ? parseCSV(csv) : defaultData;
};

// Sells operations
const getSells = () => loadData('sells', []);
const saveSells = (sells) => {
  console.log('Saving sells to localStorage:', sells);
  return saveData('sells', sells);
};

const addSells = (sell) => {
  const sells = getSells();
  const newSell = {
    ...sell,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  saveSells([...sells, newSell]);
  return newSell;
};

const deleteSells = (id) => {
  const updated = getSells().filter(s => s.id !== id);
  saveSells(updated);
  return updated;
};

const updateSells = (updatedSell) => {
  const sells = getSells();
  const index = sells.findIndex(s => s.id === updatedSell.id);
  if (index === -1) throw new Error('Sell not found');
  sells[index] = {
    ...sells[index],
    ...updatedSell,
    updatedAt: new Date().toISOString()
  };
  saveSells(sells);
  return sells[index];
};


// Discounts operations
const getDiscounts = () => loadData('discounts', []);
const saveDiscounts = (discounts) => {
  console.log('Saving discounts to localStorage:', discounts);
  return saveData('discounts', discounts);
};
const addDiscount = (discount) => {
  const discounts = getDiscounts();
  const newDiscount = {
    ...discount,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  saveDiscounts([...discounts, newDiscount]);
  return newDiscount;
};

const deleteDiscount = (id) => {
  const updated = getDiscounts().filter(discount => discount.id !== id);
  saveDiscounts(updated);
  return updated;
};

// Products operations
const getProducts = () => loadData('products', []);
const saveProducts = (products) => saveData('products', products);
const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  saveProducts([...products, newProduct]);
  return newProduct;
};


const updateProduct = (product) => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === product.id);
  
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  // Preserve the original creation date
  const { createdAt } = products[productIndex];
  const updatedProduct = {
    ...product,
    createdAt,
    updatedAt: new Date().toISOString()
  };
  
  products[productIndex] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
};

const removeProduct = (productId) => {
  const products = getProducts();
  console.log(`Removing product ${productId} from products list`, products);
  const stringProductId = String(productId);
  const filteredProducts = products.filter(product => String(product.id) !== stringProductId);
  console.log(`After filtering, remaining products:`, filteredProducts);
  saveProducts(filteredProducts);
  return filteredProducts;
};

// Users operations
const getUsers = () => loadData('users', []);
const saveUsers = (users) => saveData('users', users);
const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

const addUser = (user) => {
  const users = getUsers();
  const newUser = { 
    ...user, 
    id: Date.now().toString(),
    createdAt: new Date().toISOString() 
  };
  saveUsers([...users, newUser]);
  return newUser;
};

const updateUser = (userId, updatedData) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Don't allow changing the ID or creation date
  const { id, createdAt } = users[userIndex];
  const updatedUser = { 
    ...users[userIndex],
    ...updatedData,
    id, // Preserve the original ID
    createdAt, // Preserve the original creation date
    updatedAt: new Date().toISOString()
  };
  
  users[userIndex] = updatedUser;
  saveUsers(users);
  return updatedUser;
};

// Orders operations
const getOrders = () => {
  const orders = loadData('orders', []);
  console.log('Getting all orders from localStorage:', orders);
  return orders;
};

const saveOrders = (orders) => {
  console.log('Saving orders to localStorage:', orders);
  return saveData('orders', orders);
};

export const addOrder = (order) => {
  console.log('Adding new order:', order);
  const orders = getOrders();
  console.log('Current orders before adding:', orders);
  
  // Ensure seller and buyer IDs are strings
  if (order.buyerId) {
    order.buyerId = String(order.buyerId);
  }
  if (order.sellerId) {
    order.sellerId = String(order.sellerId);
  }
  
  const newOrder = { 
    ...order, 
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: order.status || 'pending'
  };
  
  const updatedOrders = [...orders, newOrder];
  console.log('Updated orders after adding:', updatedOrders);
  
  saveOrders(updatedOrders);
  console.log('Order saved successfully:', newOrder);
  
  return newOrder;
};

const updateOrderStatus = (orderId, status) => {
  console.log(`Updating order ${orderId} status to ${status}`);
  const orders = getOrders();
  // Convert to string for consistent comparison
  const stringOrderId = String(orderId);

  const orderIndex = orders.findIndex(order => String(order.id) === stringOrderId);
  if (status === 'completed') {
    removeProduct(order.productId); // ✅ this is the best place for it
  }

  if (orderIndex === -1) {
    console.error(`Order not found: ${orderId}`);
    throw new Error('Order not found');
  }
  
  const updatedOrder = { 
    ...orders[orderIndex], 
    status, 
    updatedAt: new Date().toISOString() 
  };
  
  orders[orderIndex] = updatedOrder;
  saveOrders(orders);
  console.log(`Order ${orderId} updated successfully:`, updatedOrder);
  
  // If order is marked as completed, remove the product from available products
  if (status === 'completed') {
    const productId = updatedOrder.productId;
    if (productId) {
      console.log(`Removing product ${productId} as order is completed`);
      try {
        // First get the product to verify it exists
        const products = getProducts();
        const productExists = products.some(product => String(product.id) === String(productId));
        
        if (productExists) {
          removeProduct(productId);
          console.log(`Product ${productId} removed successfully`);
        } else {
          console.warn(`Product ${productId} was not found in the products list`);
        }
      } catch (error) {
        console.error(`Error removing product ${productId}:`, error);
      }
    } else {
      console.warn('Cannot remove product: Order does not have a productId');
    }
  }
  
  return updatedOrder;
};

// Questions operations
const getQuestions = () => loadData('questions', []);
const saveQuestions = (questions) => saveData('questions', questions);
const addQuestion = (question) => {
  const questions = getQuestions();
  const newQuestion = {
    ...question,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  saveQuestions([...questions, newQuestion]);
  return newQuestion;
};

// Export the service functions as a default object
const csvService = {
  saveData,
  loadData,
  getProducts,
  saveProducts,
  addProduct,
  updateProduct,
  removeProduct,
  getUsers,
  saveUsers,
  findUserByEmail,
  findUserById,
  addUser,
  updateUser,
  getOrders,
  saveOrders,
  addOrder,
  updateOrderStatus,
  getQuestions,
  saveQuestions,
  addQuestion,
  getDiscounts,
  saveDiscounts,
  addDiscount,
  deleteDiscount,
  getSells,
  saveSells,
  addSells,
  deleteSells,
  updateSells
};

export default csvService;