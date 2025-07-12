import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  CloudArrowUpIcon, 
  XMarkIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/currency';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'shirts',
    stock: '',
    featured: false
  });
  const [sizes, setSizes] = useState(['M']);
  const [colors, setColors] = useState(['black']);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'shirts', label: 'Shirts' },
    { value: 'pants', label: 'Pants' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'jackets', label: 'Jackets' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'shoes', label: 'Shoes' }
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['black', 'white', 'gray', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    if (sizes.length === 0) {
      newErrors.sizes = 'At least one size is required';
    }
    if (colors.length === 0) {
      newErrors.colors = 'At least one color is required';
    }
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSizeChange = (size) => {
    setSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
    if (errors.sizes) {
      setErrors(prev => ({ ...prev, sizes: '' }));
    }
  };

  const handleColorChange = (color) => {
    setColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
    if (errors.colors) {
      setErrors(prev => ({ ...prev, colors: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast.error('Only image files are allowed');
    }

    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setImages(prev => [...prev, ...newImages]);
    
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    try {
      setLoading(true);

      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('stock', formData.stock);
      submitData.append('featured', formData.featured);
      submitData.append('sizes', JSON.stringify(sizes));
      submitData.append('colors', JSON.stringify(colors));

      // Add images
      images.forEach(image => {
        submitData.append('images', image.file);
      });

      const response = await axios.post(`${API_URL}/products`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      const message = error.response?.data?.message || 'Failed to add product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Add New Product
          </h1>
          <p className="text-gray-600 mt-1">
            Add a new product to your inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                      placeholder="Enter product description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (LKR) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        className={`input-field ${errors.stock ? 'border-red-500' : ''}`}
                        placeholder="0"
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Feature this product on homepage
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Variants */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Variants
                </h2>

                <div className="space-y-6">
                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Sizes *
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeChange(size)}
                          className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                            sizes.includes(size)
                              ? 'border-primary-600 bg-primary-600 text-white'
                              : 'border-gray-300 text-gray-700 hover:border-primary-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {errors.sizes && (
                      <p className="mt-1 text-sm text-red-600">{errors.sizes}</p>
                    )}
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Colors *
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorChange(color)}
                          className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors capitalize ${
                            colors.includes(color)
                              ? 'border-primary-600 bg-primary-600 text-white'
                              : 'border-gray-300 text-gray-700 hover:border-primary-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                    {errors.colors && (
                      <p className="mt-1 text-sm text-red-600">{errors.colors}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Images *
                </h2>

                {/* Image Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop images here or click to upload
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB each
                    </p>
                  </div>
                </div>

                {errors.images && (
                  <p className="mt-2 text-sm text-red-600">{errors.images}</p>
                )}

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Selected Images ({images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview}
                            alt="Product preview"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Preview
                </h2>

                <div className="space-y-4">
                  {images.length > 0 && (
                    <img
                      src={images[0].preview}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {formData.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description || 'Product description will appear here...'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      {formData.price ? formatCurrency(formData.price) : 'Rs. 0'}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {formData.category}
                    </span>
                  </div>

                  {sizes.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Sizes: {sizes.join(', ')}
                      </p>
                    </div>
                  )}

                  {colors.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 capitalize">
                        Colors: {colors.join(', ')}
                      </p>
                    </div>
                  )}

                  {formData.stock && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Stock: {formData.stock} units
                      </p>
                    </div>
                  )}

                  {formData.featured && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                      Featured Product
                    </span>
                  )}
                </div>
                              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding Product...' : 'Add Product'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/admin/products')}
                    className="w-full btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              </div>


            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;