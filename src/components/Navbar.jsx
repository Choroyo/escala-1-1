import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, cart } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const popupRef = useRef(null);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Close popup when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLogoPopup(false);
      }
    };
    
    // Close popup when pressing escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowLogoPopup(false);
      }
    };

    if (showLogoPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showLogoPopup]);
  
  return (
    <nav className="bg-green-700 text-white py-3 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="mr-3 flex-shrink-0 bg-utsa-orange rounded-full p-1 cursor-pointer"
            onClick={() => setShowLogoPopup(true)}
          >
            <img src={logo} alt="Rowdy Marketplace Logo" className="h-16 w-auto" />
          </div>
          <Link to="/" className="text-2xl font-bold text-utsa-orange hover:text-white transition-colors">
            ESCALA 1:1
          </Link>
        </div>
        
        {/* Logo Popup */}
        {showLogoPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div 
              ref={popupRef}
              className="bg-white p-6 rounded-xl shadow-2xl max-w-md mx-auto text-center transform transition-all"
            >
              <div className="bg-utsa-orange bg-opacity-90 rounded-full p-7 inline-block mb-4">
                <img src={logo} alt="Rowdy Marketplace Logo" className="h-48 w-auto" />
              </div>

              <p className="text-utsa-blue text-xl font-bold mb-2">El logo oficial de ESCALA 1:1.</p>
              <p className="text-sm text-gray-600 mb-4">© 2025 ESCALA 1:1. All rights reserved.</p>
              <button 
                className="bg-utsa-blue text-white px-4 py-2 rounded-full hover:bg-opacity-90"
                onClick={() => setShowLogoPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated && user?.isAdmin && (
            <Link 
              to="/admin" 
              className="px-3 py-2 hover:text-utsa-orange hover:bg-utsa-blue-900 rounded-full transition-colors"
            >
              Admin
            </Link>
          )}
          <Link to="/" className="px-3 py-2 hover:text-utsa-orange hover:bg-utsa-blue-900 rounded-full transition-colors">Inicio</Link>
          <Link to="/products" className="px-3 py-2 hover:text-utsa-orange hover:bg-utsa-blue-900 rounded-full transition-colors">Productos</Link>
          <Link to="/about" className="px-3 py-2 hover:text-utsa-orange hover:bg-utsa-blue-900 rounded-full transition-colors">Acerca</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/account" className="px-3 py-2 hover:text-utsa-orange hover:bg-utsa-blue-900 rounded-full transition-colors">Cuenta</Link>
              <Link to="/cart" className="px-3 py-2 hover:text-utsa-orange hover:bg-utsa-blue-900 rounded-full transition-colors relative"> Carrito
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-utsa-orange text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className=" text-white px-4 py-2 rounded-full font-bold hover:bg-gray-600" style={{ backgroundColor: '#a7c957' }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="bg-gray-800 text-white px-4 py-2 rounded-full  hover:bg-gray-600"

              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register"
                className="bg-gray-800 text-white px-4 py-2 rounded-full  hover:bg-gray-600"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-utsa-blue mt-2 py-3 px-4 shadow-lg border-t border-utsa-orange">
          <div className="flex flex-col space-y-3">
                    {isAuthenticated && user?.isAdmin && (
            <Link 
              to="/admin" 
              className="px-3 py-2 hover:text-utsa-orange hover:bg-utsa-blue-900 rounded-full transition-colors"
            >
              Admin
            </Link>
          )}
            <Link to="/" className="px-3 py-2 hover:bg-utsa-blue-900 hover:text-gray-600 transition-colors rounded">Inicio</Link>
            <Link to="/products" className="px-3 py-2 hover:bg-utsa-blue-900 hover:text-gray-600 transition-colors rounded">Productos</Link>
            <Link to="/about" className="px-3 py-2 hover:bg-utsa-blue-900 hover:text-gray-600 transition-colors rounded">Acerca de</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/account" className="px-3 py-2 hover:bg-utsa-blue-900 hover:text-gray-600 transition-colors rounded">Mi Cuenta</Link>
                <Link to="/cart" className="px-3 py-2 hover:bg-utsa-blue-900 hover:text-gray-600 transition-colors rounded">
                  Carrito
                  {cartItemCount > 0 && (
                    <span className="ml-2 bg-utsa-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full  hover:bg-gray-600"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="bg-gray-800 text-white px-4 py-2 rounded-full  hover:bg-gray-600"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register"
                  className="bg-gray-800 text-white px-4 py-2 rounded-full  hover:bg-gray-600"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 