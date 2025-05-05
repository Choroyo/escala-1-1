import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/store';
import csvService from '../services/csvService';
import ProductModal from '../components/ProductModal';

// Info tooltip component
const InfoTooltip = ({ text }) => {
  return (
    <div className="group relative inline-block ml-1">
      <div className="w-4 h-4 rounded-full bg-utsa-orange text-white flex items-center justify-center text-xs cursor-help font-semibold">
        i
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-60 p-2 bg-utsa-orange text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-utsa-orange"></div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, removeFromCart, user, isAuthenticated, addOrder } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');

  const sells = csvService.getSells();

  const getSaleInfo = (product) => {
    if (!product || !product.price) {
      return { isOnSale: false, originalPrice: 0, salePrice: 0 };
    }
  
    const sells = csvService.getSells() || [];
  
    const matchingSell = sells.find(sell =>
      (sell.scope === 'category' && sell.name.toLowerCase() === product.category?.toLowerCase()) ||
      (sell.scope === 'product' && sell.name.toLowerCase() === product.title?.toLowerCase())
    );
  
    const originalPrice = parseFloat(product.price) || 0;
    let salePrice = originalPrice;
  
    if (matchingSell) {
      if (matchingSell.type === 'percent') {
        salePrice = originalPrice * (1 - matchingSell.amount / 100);
      } else if (matchingSell.type === 'fixed') {
        salePrice = originalPrice - matchingSell.amount;
      }
    }
  
    return {
      isOnSale: !!matchingSell,
      originalPrice,
      salePrice: parseFloat(salePrice.toFixed(2)) // prevent undefined early
    };
  };


  // Calculate total (each item has quantity of 1)
  const subtotal = cart.reduce((sum, item) => {
    const { salePrice } = getSaleInfo(item);
    return sum + salePrice;
  }, 0);
  const taxRate = 0.0825; // 8.25% tax rate
  const tax = subtotal * taxRate;
  let discountAmount = 0;
  if (appliedDiscount) {
    discountAmount = appliedDiscount.type === 'percent'
      ? subtotal * (parseFloat(appliedDiscount.amount) / 100)
      : parseFloat(appliedDiscount.amount); // ✅ force it to number
  }
  
  const total = Math.max(subtotal + tax - discountAmount, 0);// Total including tax

  const handleRemoveItem = (e, productId) => {
    e.stopPropagation(); // Prevent triggering the card click
    removeFromCart(productId);
    toast.success('Artículo eliminado del carrito');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Por favor inicia sesión para finalizar la compra');
      navigate('/login');
      return;
    }
    
    setIsCheckingOut(true);
    console.log('Starting checkout process...', { cart, user });
    
    try {
      // Create an order for each item in the cart
      for (const item of cart) {
        // Find seller's email address for contact info
        const sellerInfo = await csvService.findUserById(item.sellerId);
        const sellerEmail = sellerInfo ? sellerInfo.email : 'Email not available';
        console.log('Found seller info:', { sellerInfo, sellerId: item.sellerId });
        
        // Ensure we have seller information
        if (!item.sellerId || !item.sellerName) {
          console.error('inMissg seller information for item:', item);
          toast.error(`Falta información del vendedor para ${item.title}`);
          continue;
        }
        
        // Calculate item price with tax
        const { salePrice } = getSaleInfo(item);
        const itemPrice = parseFloat(salePrice) || 0; // Ensure item price is a number
        const itemTax = itemPrice * taxRate;
        const itemTotal = itemPrice + itemTax;
        
        // Log the exact types and values of IDs
        console.log('ID information for new order:', {
          buyerId: user.id,
          buyerIdType: typeof user.id,
          sellerId: item.sellerId,
          sellerIdType: typeof item.sellerId
        });
        
        const order = {
          productId: item.id, 
          productTitle: item.title,
          price: itemTotal,
          quantity: 1,
          tax: itemTax,
          subtotal: itemPrice,
          buyerId: String(user.id), // Ensure consistent string type
          buyerName: user.name,
          buyerEmail: user.email,
          sellerId: String(item.sellerId), // Ensure consistent string type
          sellerName: item.sellerName,
          sellerEmail: sellerEmail,
          status: 'pending',
          productImage: item.imageUrl,
          category: item.category,
          condition: item.condition
        };
        
        console.log('Creating order:', order);
        
        // Save order to CSV/localStorage
        const savedOrder = await csvService.addOrder(order);
        console.log('Order saved to CSV/localStorage:', savedOrder);
        
        // Add to Zustand store
        addOrder(savedOrder);
        console.log('Order added to store');
      }
      
      // Clear the cart
      clearCart();
      console.log('Cart cleared');
      
      toast.success('¡Compra realizada exitosamente!');
      navigate('/account');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error al completar la compra');
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="section-title text-8xl mb-4">Tu carrito</h1>
        <p className="mb-8">Tu carrito está vacío</p>
        <Link to="/products" className="btn bg-black text-white hover:bg-gray-600 transition-colors">
          Ver productos
        </Link>
      </div>
    );
  }
  
  return (



    <>
      <div>
        <h1 className="section-title text-3xl mb-8">Tu carrito</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items (left side) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-utsa-orange">
              <div className="bg-utsa-blue text-white py-3 px-4 font-semibold">
                Artículos en el carrito ({cart.length})
              </div>
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li 
                    key={item.id} 
                    className="p-4 hover:bg-utsa-orange hover:bg-opacity-5 cursor-pointer transition-colors"
                    onClick={() => handleProductClick(item)}
                  >
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-4 overflow-hidden rounded-lg border border-utsa-orange">
                        <img 
                          src={item.imageUrl || '/placeholder-image.jpg'} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-utsa-blue">{item.title}</p>
                        <p className="text-light-gray text-sm">{item.sellerName}</p>
                        {(() => {
                          const { isOnSale, originalPrice, salePrice } = getSaleInfo(item);
                          return isOnSale ? (
                            <div className="flex flex-col">
                              <span className="text-sm line-through text-gray-400">${originalPrice.toFixed(2)}</span>
                              <span className="text-utsa-orange font-semibold">${salePrice.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-utsa-orange font-semibold">${originalPrice.toFixed(2)}</span>
                          );
                        })()}
                      </div>
                      <div>
                        <button 
                          onClick={(e) => handleRemoveItem(e, item.id)}
                          className="btn-secondary text-sm py-1 px-3"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary (right side) */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-utsa-orange">
              <h2 className="section-title mb-4">Resumen del pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} artículos)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="flex items-center">
                  Impuestos (8.25%)
                    <InfoTooltip text="Se cobra un impuesto de venta del 8.25% conforme a las regulaciones locales." />
                  </span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="flex items-center">
                    Envío
                    <InfoTooltip text="El envío es gratuito para transacciones dentro del campus. Los artículos se entregan en persona en un punto acordado." />
                  </span>
                  <span className="text-success font-medium">GRATIS</span>
                </div>
                
                {appliedDiscount && (
                  <div className="flex justify-between">
                      <span>Descuento ({appliedDiscount.code})</span>
                      <span>- ${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="btn btn-primary w-full"
              >
                {isCheckingOut ? 'Procesando...' : 'Finalizar compra'}
              </button>
              <div className="mt-6">
                <label className="block text-sm font-semibold mb-1 text-utsa-blue">Código de descuento</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Ej. BIENVENIDO10"
                    className="input flex-1"
                  />
                  <button
                    onClick={() => {
                      const allDiscounts = csvService.getDiscounts();
                      const match = allDiscounts.find(d => d.code === discountCode.trim());

                      if (!match) {
                        setAppliedDiscount(null);
                        setDiscountError('Código inválido o expirado.');
                      } else {
                        setAppliedDiscount(match);
                        setDiscountError('');
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Aplicar
                  </button>
                </div>
                {discountError && <p className="text-red-500 text-sm mt-1">{discountError}</p>}
                {appliedDiscount && (
                  <p className="text-green-600 mt-2 text-sm">
                    ✅ {appliedDiscount.code} aplicado — {appliedDiscount.type === 'percent' 
                      ? `${appliedDiscount.amount}% de descuento`
                      : `$${appliedDiscount.amount} de descuento`}
                  </p>
                )}
              </div>
              <div className="mt-4 text-center text-sm text-light-gray">
                <p>Al finalizar la compra, aceptas reunirte con el vendedor en una ubicación pública dentro o cerca de la ubicacion para completar la transacción.</p>
                <p className="mt-2">Tu correo electrónico será compartido con el vendedor para coordinar la entrega.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CartPage; 