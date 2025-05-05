import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/store';
import csvService from '../services/csvService';

const AccountPage = () => {
  const { user, isAuthenticated, updateUser } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [activeOrdersType, setActiveOrdersType] = useState('purchases');

  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Initialize profile form with user data
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [user]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      console.log('Loading user data for:', user);
      
      try {
        // Load orders
        const allOrders = await csvService.getOrders();
        console.log('All orders loaded:', allOrders);
        
        // Filter orders where user is buyer or seller
        // Using String() to ensure consistent type comparison
        const userOrdersAsBuyer = allOrders.filter(
          order => String(order.buyerId) === String(user.id)
        );
        
        const userOrdersAsSeller = allOrders.filter(
          order => String(order.sellerId) === String(user.id)
        );
        
        const combinedUserOrders = [...userOrdersAsBuyer, ...userOrdersAsSeller];
        
        console.log('Filtered orders for user:', { 
          userId: user.id, 
          totalUserOrders: combinedUserOrders.length,
          asBuyer: userOrdersAsBuyer.length,
          asSeller: userOrdersAsSeller.length,
          sellerOrders: userOrdersAsSeller
        });
        
        setOrders(combinedUserOrders);
        
        // Load products
        const allProducts = await csvService.getProducts();

        // Filter products where user is seller
        const userListings = allProducts.filter(
          product => String(product.sellerId) === String(user.id)
        );

        setListings(userListings);
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Error al cargar los datos de tu cuenta');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });

    // Clear errors for this field
    if (profileErrors[name]) {
      setProfileErrors({
        ...profileErrors,
        [name]: null
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // Update order status in CSV/localStorage
      const updatedOrder = await csvService.updateOrderStatus(orderId, newStatus);

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // If order was completed, check if the product needs to be removed from listings
      if (newStatus === 'completed') {
        // Update local listings state to remove the sold product
        const productId = updatedOrder.productId;
        if (productId) {
          setListings(prevListings => 
            prevListings.filter(listing => listing.id !== productId)
          );
          
          // If the product isn't being removed from the store, force a reload of listings
          setTimeout(() => {
            const loadListings = async () => {
              const allProducts = await csvService.getProducts();
              const userListings = allProducts.filter(
                product => product.sellerId === user.id
              );
              setListings(userListings);
            };
            loadListings();
          }, 500);
        }
      }
      
      toast.success(`Estado de orden actualizado a ${newStatus}`);
    } catch (error) {
      console.error('Error actualizando el estado de la orden:', error);
      toast.error('No se pudo actualizar el estado');
    }
  };
  
  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setProfileErrors({});
    
    // Validate form
    const errors = {};
    let hasError = false;
    
    if (!profileForm.name.trim()) {
      errors.name = 'El nombre es obligatorio';
      hasError = true;
    }
    
    if (!profileForm.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio';
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'El correo electrónico no es válido';
      hasError = true;
    }
    
    // If user wants to change password
    if (profileForm.newPassword) {
      if (!profileForm.password) {
        errors.password = 'Se requiere la contraseña actual para establecer una nueva';
        hasError = true;
      }
      
      if (profileForm.newPassword.length < 6) {
        errors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
        hasError = true;
      }
      
      if (profileForm.newPassword !== profileForm.confirmNewPassword) {
        errors.confirmNewPassword = 'Las contraseñas no coinciden';
        hasError = true;
      }
    }
    
    if (hasError) {
      setProfileErrors(errors);
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Check if email changed and is already in use
      if (profileForm.email !== user.email) {
        const existingUser = csvService.findUserByEmail(profileForm.email);
        if (existingUser && existingUser.id !== user.id) {
          setProfileErrors({
            email: 'El correo electrónico ya está en uso por otra cuenta'
          });
          setIsUpdating(false);
          return;
        }
      }
      
      // Verify current password if changing password
      if (profileForm.newPassword) {
        // In a real app, you would hash and compare the passwords
        if (profileForm.password !== user.password) {
          setProfileErrors({
            password: 'La contraseña actual es incorrecta'
          });
          setIsUpdating(false);
          return;
        }
      }
      
      // Prepare data for update
      const updateData = {
        name: profileForm.name,
        email: profileForm.email,
      };
      
      // Add new password if user is changing it
      if (profileForm.newPassword) {
        updateData.password = profileForm.newPassword;
      }
      
      // Update user in CSV storage
      const updatedUser = csvService.updateUser(user.id, updateData);
      
      // Update user in Zustand store
      updateUser(updateData);
      
      // Reset password fields
      setProfileForm({
        ...profileForm,
        password: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('No se pudo actualizar el perfil');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Filter orders based on selected type
  const filteredOrders = orders.filter(order => {
    if (activeOrdersType === 'purchases') {
      return String(order.buyerId) === String(user?.id);
    } else if (activeOrdersType === 'sales') {
      return String(order.sellerId) === String(user?.id);
    }
    return false;
  });
  
  // Add debug info for orders
  const buyerOrdersCount = orders.filter(order => String(order.buyerId) === String(user?.id)).length;
  const sellerOrdersCount = orders.filter(order => String(order.sellerId) === String(user?.id)).length;
  
  console.log('Displaying filtered orders:', { 
    activeOrdersType,
    userId: user?.id, 
    filteredOrders,
    ordersLength: orders.length,
    buyerOrdersCount,
    sellerOrdersCount
  });
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>
      
      {/* Debug Information - Only visible in development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-yellow-100 rounded-lg text-sm">
          <h3 className="font-bold mb-2">Debug Information</h3>
          <p>User ID: {user?.id}</p>
          <p>Orders in state: {orders.length}</p>
          <p>Orders as buyer: {buyerOrdersCount}</p>
          <p>Orders as seller: {sellerOrdersCount}</p>
          <p>Currently viewing: {activeOrdersType}</p>
          <div className="mt-2">
            <button 
              onClick={() => setActiveOrdersType('purchases')}
              className="bg-blue-500 text-white px-2 py-1 text-xs rounded mr-2"
            >
              Show Purchases
            </button>
            <button 
              onClick={() => setActiveOrdersType('sales')}
              className="bg-green-500 text-white px-2 py-1 text-xs rounded"
            >
              Show Sales
            </button>
          </div>
        </div>
      )} */}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* User Info */}
        <div className="p-6  text-white" style={{backgroundColor: '#6a994e'}}>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-white">{user.email}</p>
          <p className="text-white text-sm mt-1">
          Cuenta creada: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-utsa-orange text-utsa-blue'
                  : 'text-light-gray hover:text-utsa-blue'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Perfil
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'orders'
                  ? 'border-b-2 border-utsa-orange text-utsa-blue'
                  : 'text-light-gray hover:text-utsa-blue'
              }`}
              onClick={() => setActiveTab('orders')}
            >
               Mis Órdenes
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {isLoading && activeTab !== 'profile' ? (
            <div className="text-center py-8">Cargando...</div>
          ) : activeTab === 'profile' ? (
            /* Profile Tab */
            <div>
              <h3 className="text-xl font-semibold mb-6">Editar tu Perfil</h3>
              
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`w-full p-2 border rounded ${profileErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      value={profileForm.name}
                      onChange={handleProfileChange}
                    />
                    {profileErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full p-2 border rounded ${profileErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                    {profileErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>
                    )}
                  </div>
                </div>
                
                <h4 className="text-lg font-medium mt-8 mb-4 border-b pb-2">Cambiar Contraseña</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Contraseña Actual
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`w-full p-2 border rounded ${profileErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                      value={profileForm.password}
                      onChange={handleProfileChange}
                      placeholder="Requiere para cambiar contraseña"
                    />
                    {profileErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{profileErrors.password}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* New Password Field */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                    Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className={`w-full p-2 border rounded ${profileErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                      value={profileForm.newPassword}
                      onChange={handleProfileChange}
                      placeholder="Escribe tu nueva contraseña"
                    />
                    {profileErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">{profileErrors.newPassword}</p>
                    )}
                  </div>
                  
                  {/* Confirm New Password Field */}
                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-1">
                    Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      className={`w-full p-2 border rounded ${profileErrors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'}`}
                      value={profileForm.confirmNewPassword}
                      onChange={handleProfileChange}
                      placeholder="Confirmar Nueva Contraseña"
                    />
                    {profileErrors.confirmNewPassword && (
                      <p className="text-red-500 text-xs mt-1">{profileErrors.confirmNewPassword}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    className="btn bg-black text-white hover:bg-gray-800 hover:text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          ) : activeTab === 'orders' ? (
            /* Orders Tab */
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {filteredOrders.length > 0 ? 'Tus Órdenes' : 'Aún No Tienes Órdenes'}
                  </h3>
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2 text-sm rounded-full transition-colors font-semibold ${
                        activeOrdersType === 'purchases'
                          ? 'bg-utsa-blue text-white  hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => setActiveOrdersType('purchases')}
                    >
                      Mis Compras
                    </button>
                    <button
                      className={`px-4 py-2 text-sm rounded-full transition-colors font-semibold ${
                        activeOrdersType === 'sales'
                          ? 'bg-utsa-blue text-white  hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => setActiveOrdersType('sales')}
                    >
                     Mis Ventas
                    </button>
                  </div>
                </div>
                <p className="text-sm text-black mt-2">
                  {activeOrdersType === 'purchases' 
                    ? 'Productos que has comprado...' 
                    : 'Productos que has vendido...'}
                </p>
                
                {/* Show seller specific instructions */}
                {activeOrdersType === 'sales' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <p className="text-blue-700">
                      <strong>Instrucciones para el Vendedor: </strong>Necesitas confirmar las órdenes de los compradores para completar la venta. Busca el botón "Marcar como Completada" en las órdenes pendientes.
                    </p>
                  </div>
                )}
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg">
                  <p className="mb-4">
                    {activeOrdersType === 'purchases' 
                      ? "Aún no has comprado ningún producto." 
                      : "Aún no has vendido ningún producto."}
                  </p>
                  {activeOrdersType === 'purchases' ? (
                    <Link to="/products" className="btn-primary">
                      Ver Productos
                    </Link>
                  ) : (
                    <Link to="/sell" className="px-4 py-2 text-sm rounded-full transition-colors font-semibold bg-utsa-blue text-white  hover:bg-gray-600">
                      Publicar un Producto
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-4 py-3 text-left text-xs font-medium text-light-gray uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-light-gray uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-light-gray uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-light-gray uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-light-gray uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-light-gray uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="border-t hover:bg-white">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              {order.productImage && (
                                <div className="w-12 h-12 mr-3 overflow-hidden rounded">
                                  <img 
                                    src={order.productImage} 
                                    alt={order.productTitle}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{order.productTitle}</p>
                                <p className="text-sm text-black">
                                  {activeOrdersType === 'purchases' 
                                    ? `Seller: ${order.sellerName}` 
                                    : `Buyer: ${order.buyerName}`}
                                </p>
                                {order.category && (
                                  <p className="text-xs text-black mt-1">
                                    {order.category} | {order.condition}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            ${parseFloat(order.price).toFixed(2)}
                          </td>
                          <td className="px-4 py-4">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium">
                                {activeOrdersType === 'purchases' 
                                  ? order.sellerName 
                                  : order.buyerName}
                              </p>
                              <p className="text-sm text-black">
                                Contacto: <a 
                                  href={`mailto:${activeOrdersType === 'purchases' 
                                    ? (order.sellerEmail || user.email) 
                                    : (order.buyerEmail || user.email)}`}
                                  className="text-utsa-blue hover:underline"
                                >
                                  {activeOrdersType === 'purchases' 
                                    ? (order.sellerEmail || 'Correo no disponible') 
                                    : (order.buyerEmail || 'Correo no disponible')}
                                </a>
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'canceled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {/* Show action buttons based on user role and order status */}
                            {order.status === 'pending' && (
                              <div className="flex space-x-2">
                                {activeOrdersType === 'sales' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                    className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                  >
                                   Marcar como Completada
                                  </button>
                                )}
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'canceled')}
                                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  	Cancelar
                                </button>
                              </div>
                            )}
                            
                            {order.status === 'completed' && (
                              <span className="text-xs text-black">
                                {activeOrdersType === 'purchases' 
                                  ? 'Compra completada' 
                                  : '	Venta completada'}
                              </span>
                            )}
                            
                            {order.status === 'canceled' && (
                              <span className="text-xs text-black">
                                Orden cancelada
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            /* Listings Tab */
            <>
              
              {listings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-4">Aún no has publicado ningún producto.</p>
                  <Link to="/sell" className="btn bg-black text-white hover:bg-gray-800">
                  Crear tu Primera Publicación
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map(listing => (
                    <div key={listing.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={listing.imageUrl} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-1">{listing.title}</h4>
                        <p className="text-utsa-blue font-bold mb-2">
                          ${parseFloat(listing.price).toFixed(2)}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {listing.category}
                          </span>
                          <Link 
                            to={`/edit-product/${listing.id}`}
                            className="text-sm text-utsa-blue hover:underline"
                          >
                            Editar
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;