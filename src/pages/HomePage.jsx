import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import csvService from '../services/csvService';
import homeBanner from '../assets/homeBanner.jpg';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Get all products and select a few as featured
        const allProducts = await csvService.getProducts();
        
        // Sort by creation date (newest first) and take the first 4
        const featured = allProducts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
          
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  return (
    <div>
      {/* Hero Section with blur background */}
      <div className="relative rounded-lg mb-12 overflow-hidden">
        {/* Blurred background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${homeBanner})`,
            filter: 'blur(4px)',
            opacity: 0.6,
          }}
        ></div>

        {/* Content above the blur */}
        <div className="relative z-10 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-black">Bienvenidos a ESCALA 1:1</h1>
            <p className="text-xl mb-8 text-black">TU PASIÓN POR LA CONSTRUCCIÓN ¡AHORA ESTÁ AQUÍ!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="btn bg-white text-utsa-blue hover:bg-utsa-blue hover:text-white"
              >
                Buscar productos
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recientemente Agregados</h2>
          <Link to="/products" className="text-utsa-blue hover:underline">
            Ver Todos
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      
      {/* CTA */}
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-utsa-blue">¿Listo para Comenzar?</h2>
        <p className="mb-6">Únete hoy al mercado comunitario.</p>
        <Link 
          to="/register" 
          className="bg-black text-white hover:bg-gray-800 py-3 px-6 rounded-full inline-block transition-colors"
        >
          Crear una Cuenta
        </Link>
      </div>
    </div>
  );
};

export default HomePage; 