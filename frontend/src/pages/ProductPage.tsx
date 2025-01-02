import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Offer {
  name: string;
  description?: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  descriptionImage: string;
  originalPrice: number;
  discountedPrice: number;
  offers: Offer[];
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setSelectedOffer(data.offers[0]);
        setLoading(false);
      } catch (error) {
        toast.error('Error loading product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) {
      toast.error('Please select an offer');
      return;
    }

    try {
      const orderData = {
        product: product?._id,
        customerName: formData.name,
        phoneNumber: formData.phone,
        address: formData.address,
        selectedOffer,
        totalAmount: selectedOffer.price
      };

      const { data } = await axios.post('/api/orders', orderData);
      navigate(`/thank-you/${data._id}`);
    } catch (error) {
      toast.error('Error submitting order');
    }
  };

  if (loading) {
    return (
      <div className="mobile-container p-4">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mobile-container p-4">
        <p className="text-center text-red-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="mobile-container pb-8">
      {/* Logo */}
      <div className="p-4 border-b">
        <img src="/logo.png" alt="Logo" className="h-12 mx-auto" />
      </div>

      {/* Product Image */}
      <img src={product.image} alt={product.name} className="product-image" />

      {/* Product Info */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="price-tag">{product.discountedPrice} د.ج</span>
          <span className="original-price">{product.originalPrice} د.ج</span>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">الاسم الكامل</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">رقم الهاتف</label>
            <input
              type="tel"
              required
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">العنوان</label>
            <textarea
              required
              className="form-input"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Offers */}
          <div className="space-y-2">
            <label className="block text-gray-700 mb-2">اختر العرض المناسب</label>
            {product.offers.map((offer) => (
              <div
                key={offer.name}
                className={`offer-card ${selectedOffer?.name === offer.name ? 'selected' : ''}`}
                onClick={() => setSelectedOffer(offer)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{offer.name}</h3>
                  <span className="font-bold text-primary-600">{offer.price} د.ج</span>
                </div>
                {offer.description && (
                  <p className="text-gray-600 text-sm mt-1">{offer.description}</p>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary">
            اطلب الآن
          </button>
        </form>

        {/* Description Image */}
        <div className="mt-8">
          <img src={product.descriptionImage} alt="Product Description" className="description-image" />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
