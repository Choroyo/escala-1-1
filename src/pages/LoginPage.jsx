import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/store';
import csvService from '../services/csvService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, addOrder } = useStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadUserOrders = async (userId) => {
    try {
      console.log('Loading orders for user after login:', userId);
      const allOrders = await csvService.getOrders();
      
      // Find orders where the user is either buyer or seller
      const userOrders = allOrders.filter(
        order => String(order.buyerId) === String(userId) || String(order.sellerId) === String(userId)
      );
      
      console.log('Found user orders:', userOrders);
      console.log('Detailed user order check:', {
        userId: userId,
        userIdType: typeof userId,
        orderCount: allOrders.length,
        foundOrderCount: userOrders.length,
        // Show first order buyerId and sellerId if exists for debugging
        sampleOrder: allOrders.length > 0 ? {
          buyerId: allOrders[0].buyerId,
          buyerIdType: typeof allOrders[0].buyerId,
          sellerId: allOrders[0].sellerId,
          sellerIdType: typeof allOrders[0].sellerId
        } : null
      });
      
      // Add each order to the store
      userOrders.forEach(order => {
        console.log('Adding order to store:', order);
        addOrder(order);
      });
      
    } catch (error) {
      console.error('Error loading user orders:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Find user by email
      const user = csvService.findUserByEmail(formData.email);
      
      // Check if user exists
      if (!user) {
        setErrors({
          email: 'No account found with this email'
        });
        toast.error('No account exists with this email. Please create an account first.', {
          duration: 5000,
          icon: '🔔'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Process isAdmin flag
      user.isAdmin = user.isAdmin === true || user.isAdmin === 'true';
      
      // Check password
      if (user.password !== formData.password) {
        setErrors({
          password: 'Incorrect password'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Login successful
      login(user);
      
      // Load user's orders
      await loadUserOrders(user.id);
      
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        {Object.keys(errors).map((key) => (
          <div key={key} className="mb-4 p-3 bg-red-100 text-error rounded">
            {errors[key]}
          </div>
        ))}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="your.name@my.utsa.edu"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-utsa-blue hover:underline">
              Register here
            </Link>
          </p>
        </div>
        
        
      </div>
    </div>
  );
};

export default LoginPage; 