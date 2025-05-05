import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useStore from './store/store';
import csvService from './services/csvService';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import CartPage from './pages/CartPage';
import SellItemPage from './pages/SellItemPage';
import EditProductPage from './pages/EditProductPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import initializeAppData, { updateExistingOrdersWithEmails } from './services/initData';

function App() {
  const { addOrder } = useStore();

  // Initialize app data on first load
  useEffect(() => {
    initializeAppData();
    
    // Ensure all orders have email information
    updateExistingOrdersWithEmails();
  }, []);

  // Initialize orders from localStorage when app starts
  useEffect(() => {
    const loadInitialOrders = async () => {
      console.log('Initializing orders from localStorage');
      try {
        const orders = await csvService.getOrders();
        console.log('Orders loaded from localStorage:', orders);
        
        // Add each order to the store
        orders.forEach(order => {
          console.log('Adding order to store on init:', order);
          
          // Ensure IDs are consistently strings
          if (order.buyerId) {
            order.buyerId = String(order.buyerId);
          }
          if (order.sellerId) {
            order.sellerId = String(order.sellerId);
          }
          
          addOrder(order);
        });
        
        console.log('Orders initialized successfully');
      } catch (error) {
        console.error('Error initializing orders:', error);
      }
    };
    
    loadInitialOrders();
  }, [addOrder]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/sell" element={<SellItemPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<div className="text-center py-12"><h1 className="text-3xl font-bold">Page Not Found</h1></div>} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App; 