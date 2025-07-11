import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../utils/currency';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products?featured=true&limit=4`);
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { 
      name: 'Shirts', 
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop&crop=center',
      fallback: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
      path: '/products?category=shirts' 
    },
    { 
      name: 'Dresses', 
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop&crop=center',
      fallback: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop',
      path: '/products?category=dresses' 
    },
    { 
      name: 'Pants', 
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&crop=center',
      fallback: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      path: '/products?category=pants' 
    },
    { 
      name: 'Accessories', 
      image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=300&h=300&fit=crop&crop=center',
      fallback: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=300&h=300&fit=crop',
      path: '/products?category=accessories' 
    }
  ];

  const handleImageError = (e, fallbackSrc) => {
    if (fallbackSrc && e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold font-display mb-6">
                Fashion That Speaks
                <span className="block text-primary-200">Your Style</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Discover the latest trends in ready-made fashion and custom tailoring. 
                From casual wear to elegant evening dresses, find your perfect style at Asali House of Fashion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/products?featured=true"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Featured Items
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=600&fit=crop&crop=center"
                  alt="Fashion Model"
                  onError={(e) => handleImageError(e, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=600&fit=crop')}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 font-display mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection of fashion items, carefully curated for every occasion and style preference.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    onError={(e) => handleImageError(e, category.fallback)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold font-display">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 font-display mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked items that represent the best of our collection
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="aspect-square bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="card hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0] || '/api/placeholder/300/300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary px-8 py-3 text-lg"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over Rs. 15,000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✂️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Tailoring</h3>
              <p className="text-gray-600">Professional tailoring services available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy on all items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;