import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/store';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onClose }) => {
  const { addToCart, user } = useStore();
  
  if (!product) return null;
  
  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };
  
  // Format price to display with 2 decimal places
  const formattedPrice = parseFloat(product.price).toFixed(2);
  
  // Check if current user is the seller
  const isUserSeller = user && user.id === product.sellerId;
  
  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-utsa-orange">
        <div className="relative">
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-utsa-blue hover:text-utsa-orange z-10 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Product Image */}
            <div>
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="w-full h-auto object-cover rounded-lg border border-utsa-orange"
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h2 className="text-2xl font-bold mb-2 text-utsa-blue">{product.title}</h2>
              
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold text-utsa-orange">${formattedPrice}</span>
                <span className="ml-3 px-3 py-1 bg-white text-black rounded-full text-sm">
                  {product.condition}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-utsa-blue">Description</h3>
                <p className="text-black">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-light-gray">Category</h4>
                    <p>{product.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-light-gray">Posted On</h4>
                    <p>{formatDate(product.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-light-gray">Seller</h4>
                    <p>{product.sellerName}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                {isUserSeller ? (
                  <Link 
                    to={`/edit-product/${product.id}`}
                    className="flex-1 btn btn-primary flex items-center justify-center"
                    onClick={onClose}
                  >
                    Edit Your Listing
                  </Link>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 btn btn-primary flex items-center justify-center"
                  >
                    Add to Cart
                  </button>
                )}
                
                <Link 
                  to={`/products/${product.id}`}
                  className="flex-1 btn btn-secondary flex items-center justify-center"
                  onClick={onClose}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 