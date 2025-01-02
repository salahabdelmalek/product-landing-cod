import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'لوحة التحكم',
      icon: HomeIcon,
      path: '/admin',
    },
    {
      name: 'المنتجات',
      icon: ShoppingBagIcon,
      path: '/admin/products',
    },
    {
      name: 'الطلبات',
      icon: ClipboardDocumentListIcon,
      path: '/admin/orders',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  return (
    <div className="h-screen w-64 bg-white border-r">
      <div className="p-4">
        <img src="/logo.png" alt="Logo" className="h-8 mx-auto" />
      </div>

      <nav className="mt-8">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 flex-shrink-0 h-6 w-6" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
