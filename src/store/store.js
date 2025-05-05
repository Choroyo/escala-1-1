import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updatedUserData) => {
        // Update the user in the store
        set({ user: { ...get().user, ...updatedUserData } });
      },
      
      // Cart state
      cart: [],
      addToCart: (product) => {
        console.log('Store addToCart called with:', product);
        
        // Validate product has seller information
        if (!product.sellerId || !product.sellerName) {
          console.error('Product missing seller information:', product);
          return;
        }
        
        const cart = get().cart;
        const itemExists = cart.find(item => item.id === product.id);
        
        if (itemExists) {
          // Item already exists in cart, don't add duplicate
          toast.info(`${product.title} is already in your cart`);
          return;
        }
        
        // Add new item to cart (always quantity of 1)
        console.log('Adding product to cart:', product);
        set({ cart: [...cart, { ...product }] });
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.id !== productId) });
      },
      clearCart: () => set({ cart: [] }),
      
      // Orders state
      orders: [],
      addOrder: (order) => {
        console.log('Adding order to store:', order);
        const currentOrders = get().orders;
        console.log('Current orders in store:', currentOrders);
        set({ orders: [...currentOrders, order] });
        console.log('Updated store orders:', [...currentOrders, order]);
      },
      
      // Product listings (for sellers)
      listings: [],
      addListing: (listing) => set({ 
        listings: [...get().listings, { ...listing, id: Date.now().toString() }] 
      }),
      updateListing: (updatedProduct) => {
        set({
          listings: get().listings.map(listing => 
            listing.id === updatedProduct.id 
              ? updatedProduct 
              : listing
          )
        });
      },
      removeListing: (listingId) => {
        set({ listings: get().listings.filter(listing => listing.id !== listingId) });
      },
    }),
    {
      name: 'rowdy-marketplace-storage',
    }
  )
);

export default useStore; 