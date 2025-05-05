import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/store';
import csvService from '../services/csvService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useStore();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const products = await csvService.getProducts();
        const foundProduct = products.find(p => p.id === id);
        
        if (!foundProduct) {
          setError('Product not found');
        } else {
          setProduct(foundProduct);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    console.log('Adding product to cart with seller info:', {
      product,
      sellerId: product.sellerId,
      sellerName: product.sellerName
    });
    
    // Verify product has seller information before adding to cart
    if (!product.sellerId || !product.sellerName) {
      console.error('Product missing seller information:', product);
      toast.error('Unable to add to cart: Missing seller information');
      return;
    }
    
    addToCart(product);
    toast.success(`Added ${product.title} to cart!`);
  };
  
  // Check if current user is the seller
  const isUserSeller = user && product && user.id === product.sellerId;
  
  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return <div className="text-center py-12">Loading product details...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-error mb-4">{error}</h2>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4">
        <Link to="/products" className="text-utsa-blue hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="p-4">
            <img 
              src={product.imageUrl} 
              alt={product.title}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          
          {/* Product Info */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-utsa-blue">${parseFloat(product.price).toFixed(2)}</span>
              <span className="ml-3 px-3 py-1 bg-white text-black rounded-full text-sm">
                {product.condition}
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-black">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-light-gray">Category</h3>
                  <p>{product.category}</p>
                </div>
                <div>
                  <h3 className="text-sm text-light-gray">Posted On</h3>
                  <p>{formatDate(product.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-light-gray">Seller</h3>
                  <p>{product.sellerName}</p>
                </div>
              </div>
            </div>
            
            {isUserSeller ? (
              <div className="space-y-3">
                <p className="text-sm text-light-gray italic mb-2">
                  This is your listing
                </p>
                <Link 
                  to={`/edit-product/${product.id}`}
                  className="btn bg-utsa-blue text-white hover:bg-opacity-90 w-full block text-center"
                >
                  Edit Your Listing
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="btn-primary w-full"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 