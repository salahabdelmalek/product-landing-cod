import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const ThankYouPage = () => {
  const { orderId } = useParams();

  return (
    <div className="mobile-container">
      {/* Logo */}
      <div className="p-4 border-b">
        <img src="/logo.png" alt="Logo" className="h-12 mx-auto" />
      </div>

      <div className="p-8 text-center">
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold mb-4">
          شكراً لك! تم استلام طلبك بنجاح
        </h1>
        
        <p className="text-gray-600 mb-4">
          رقم الطلب: {orderId}
        </p>
        
        <p className="text-gray-600 mb-8">
          سنتصل بك قريباً لتأكيد طلبك
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
