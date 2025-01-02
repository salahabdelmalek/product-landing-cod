import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
}

const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        toast.error('Error loading products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="mobile-container p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-200 h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container pb-8">
      {/* Logo */}
      <div className="p-4 border-b mb-4">
        <img src="/logo.png" alt="Logo" className="h-12 mx-auto" />
      </div>

      {/* Products Grid */}
      <div className="p-4 grid gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg mb-2">{product.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-primary-600 font-bold">
                  {product.discountedPrice} د.ج
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice} د.ج
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StorePage;
