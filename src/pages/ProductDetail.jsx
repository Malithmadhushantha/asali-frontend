import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon, HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { formatCurrency } from '../utils/currency';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
      
      // Set default selections
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products?category=${product.category}&limit=4`
      );
      // Filter out current product
      const related = response.data.products.filter(p => p._id !== product._id);
      setRelatedProducts(related.slice(0, 4));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-primary-600 capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={product.images[selectedImage] || '/api/placeholder/600/600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">(4.0) 23 reviews</span>
                </div>
                <span className="text-sm text-gray-500 capitalize">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-4xl font-bold text-primary-600">
                {formatCurrency(product.price)}
              </p>
              {product.featured && (
                <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-primary-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Color: <span className="font-normal capitalize">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-4 text-sm font-medium rounded-lg border transition-colors capitalize ${
                        selectedColor === color
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-primary-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-16 text-center text-lg font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
              <button className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                <HeartIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-medium">AF{product._id.slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span className="font-medium">{product.stock} items</span>
                </div>
                {product.sizes.length > 0 && (
                  <div className="flex justify-between">
                    <span>Available Sizes:</span>
                    <span className="font-medium">{product.sizes.join(', ')}</span>
                  </div>
                )}
                {product.colors.length > 0 && (
                  <div className="flex justify-between">
                    <span>Available Colors:</span>
                    <span className="font-medium capitalize">{product.colors.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 font-display mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct._id}`}
                  className="card hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.images[0] || '/api/placeholder/300/300'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-xl font-bold text-primary-600">
                      {formatCurrency(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;