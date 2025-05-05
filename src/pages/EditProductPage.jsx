import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/store';
import csvService from '../services/csvService';
import { categories } from '../data/sampleData';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateListing } = useStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'Used - Good',
    imageUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  
  // Load the product data on component mount
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const products = await csvService.getProducts();
        const product = products.find(p => p.id === id);
        const isOwnerOrAdmin = user?.id === product?.sellerId || user?.isAdmin;
        const isUserSeller = user?.id === product.sellerId || user?.isAdmin;

        if (!isOwnerOrAdmin) {
          toast.error('Product not found');
          navigate('/products');
          return;
        }
        
        // Check if current user is the seller
        if (!isUserSeller) {
          toast.error('You do not have permission to edit this listing');
          navigate('/products');
          return;
        }
        
        // Set form data with product details
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          condition: product.condition,
          imageUrl: product.imageUrl
        });
        
        // Set preview image
        setPreviewImage(product.imageUrl);
        
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated && id) {
      loadProduct();
    }
  }, [id, isAuthenticated, user, navigate]);
  
  const conditions = [
    'New',
    'Like New',
    'Used - Excellent',
    'Used - Good',
    'Used - Fair',
    'Used - Poor'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // File size validation (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Image must be less than 2MB' });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      setFormData({ ...formData, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.imageUrl) {
      newErrors.image = 'Product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update product listing
      const updatedProduct = {
        id: id, // Keep the same ID
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        imageUrl: formData.imageUrl,
        sellerId: user.id,
        sellerName: user.name
      };
      
      // Save to CSV/localStorage
      const savedProduct = csvService.updateProduct(updatedProduct);
      
      // Update store
      updateListing(savedProduct);
      
      toast.success('Your listing has been updated successfully!');
      navigate(`/products/${savedProduct.id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('There was an error updating your listing');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading) {
    return <div className="text-center py-12">Loading product details...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Your Listing</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? 'border-error' : ''}`}
            />
            {errors.title && (
              <p className="text-error text-xs mt-1">{errors.title}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`input min-h-[100px] ${errors.description ? 'border-error' : ''}`}
            />
            {errors.description && (
              <p className="text-error text-xs mt-1">{errors.description}</p>
            )}
          </div>
          
          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price ($)*
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={`input ${errors.price ? 'border-error' : ''}`}
            />
            {errors.price && (
              <p className="text-error text-xs mt-1">{errors.price}</p>
            )}
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input ${errors.category ? 'border-error' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-error text-xs mt-1">{errors.category}</p>
            )}
          </div>
          
          {/* Condition */}
          <div className="mb-4">
            <label htmlFor="condition" className="block text-sm font-medium mb-1">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="input"
            >
              {conditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
          
          {/* Product Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Product Image*
            </label>
            
            {/* Current Image Preview */}
            {previewImage && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Current Image:</p>
                <img 
                  src={previewImage} 
                  alt="Current" 
                  className="w-full max-w-xs h-auto border rounded mb-2"
                />
              </div>
            )}
            
            <p className="text-sm mb-2">Upload a new image (optional):</p>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`input ${errors.image ? 'border-error' : ''}`}
            />
            {errors.image && (
              <p className="text-error text-xs mt-1">{errors.image}</p>
            )}
            <p className="text-xs text-light-gray mt-1">
              Max file size: 2MB. Recommended dimensions: 300x200 pixels.
            </p>
          </div>
          
          {/* Submit and Cancel Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => navigate(`/products/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage; 