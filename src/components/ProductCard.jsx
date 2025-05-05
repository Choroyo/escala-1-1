import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/store';
import toast from 'react-hot-toast';
import ProductModal from './ProductModal';

const ProductCard = ({ product, isOnSale = false, originalPrice, salePrice }) => {
  const { addToCart, user } = useStore();
  const [showModal, setShowModal] = useState(false);
  const currencyCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click event
    addToCart(product);
  };
  
  const handleCardClick = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  // Format price to display with 2 decimal places
  // Ensure price is treated as a number before calling toFixed
  const formattedPrice = currencyCOP.format(product.price);
  
  // Check if current user is the seller
  const isUserSeller = user && user.id === product.sellerId;
  
  return (
    <>
      <div 
        className="group text-black rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer hover:border-black hover:scale-[1.02]" style ={{ backgroundColor: '#f2e8cf' }} 
        onClick={handleCardClick}
      >
        <div className="overflow-hidden rounded-lg">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg transition-colors duration-200 group-hover:text-gray-500" style={{ color: '#386641' }}>{product.title} </h3>
            {isOnSale ? (
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-400 line-through">{currencyCOP.format(originalPrice)}</span>
                <span className="font-bold" style={{ color: "#003049" }}>{currencyCOP.format(salePrice)}</span>
                <span className="text-xs text-black bg-white px-2 py-0.5 rounded-full mt-1">En Oferta</span>
              </div>
            ) : (
              <span className="font-bold" style={{ color: "#003049" }}>{formattedPrice}</span>
            )}
          </div>
          
          <p className="text-sm text-g mt-1 font-semibold" style={{color: "#003049" }}>{product.category}</p>
          
          <p className="line-clamp-2 text-sm mt-2 h-10">
            {product.description}
          </p>
          
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs px-2 py-1 rounded-full text-white font-bold" style={{ backgroundColor: '#6a994e' }} >
              {product.condition}
            </span>
          </div>
          
          <div className="mt-4">
            {isUserSeller ? (
              <Link 
                to={`/edit-product/${product.id}`}
                className="w-full btn btn-secondary flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // Prevent card click event
              >
                Editar producto
              </Link>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="w-full bg-white text-black px-4 py-2 rounded-full hover:bg-gray-400 transition-colors"
              >
               Agregar al carrito
              </button>
            )}
          </div>
        </div>
      </div>
      
      {showModal && (
        <ProductModal 
          product={product} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default ProductCard; 