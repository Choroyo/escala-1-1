import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className=" text-white py-8 mt-auto" style={{ backgroundColor: '#386641' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ESCALA 1:1</h3>
            <p className="text-sm">
              Un lugar donde puedes comprar productos relacionados con la comunidad de arquitectura.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-utsa-orange">Inicio</Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-utsa-orange"> Buscar Productos</Link>
              </li>
              <li>
                <Link to="/sell" className="text-sm hover:text-utsa-orange"> Vender Productos</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-utsa-orange"> Acerca de</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contactos</h3>
            <p className="text-sm mb-2">Numero telefonico: 512-123-4567</p>
            <p className="text-sm mb-2">Bogota, Bogota</p>
            <p className="text-sm">soporte@escala.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ESCALA 1:1. All rights reserved.</p>
          <p className="mt-1">Este es un prototipo para propositos estudiantiles pagina no funcional.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 