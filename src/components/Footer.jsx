import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-400 font-display mb-4">
              Asali House of Fashion
            </h3>
            <p className="text-gray-300 mb-4">
              Your premier destination for ready-made and tailored fashion. 
              We bring you the latest trends with exceptional quality and style.
            </p>
            <p className="text-gray-400 text-sm">
              © 2024 Asali House of Fashion. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=shirts" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=dresses" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <p>📧 info@asalihouse.com</p>
              <p>📞 +94 701 423 121 </p>
              <p>📍 20 Mail Post, Palugassegama, Saliyawewa Junction</p>
            </div>
            
            <div className="mt-6">
              <h5 className="text-md font-semibold mb-2">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            Made with ❤️ for fashion enthusiasts
          </p>
          <p className="text-gray-400 text-sm">
            🛠️ Developed by Malith Madushantha.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Return Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;