import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/admin/Sidebar';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Order {
  _id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  product: {
    name: string;
    image: string;
  };
  selectedOffer: {
    name: string;
    price: number;
  };
  status: string;
  totalAmount: number;
  createdAt: string;
}

const orderStatuses = [
  { value: 'new', label: 'جديد', color: 'bg-blue-100 text-blue-800' },
  { value: 'confirmed', label: 'مؤكد', color: 'bg-green-100 text-green-800' },
  { value: 'pending', label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
  {
    value: 'in-delivery',
    label: 'قيد التوصيل',
    color: 'bg-purple-100 text-purple-800',
  },
  { value: 'delivered', label: 'تم التوصيل', color: 'bg-gray-100 text-gray-800' },
  { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800' },
  { value: 'rejected', label: 'مرفوض', color: 'bg-pink-100 text-pink-800' },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (error) {
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('تم تحديث حالة الطلب بنجاح');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">الطلبات</h1>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">كل الطلبات</option>
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={order.product.image}
                          alt={order.product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.selectedOffer.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalAmount} د.ج
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'PPpp', { locale: ar })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`text-sm rounded-full px-3 py-1 font-semibold ${
                          orderStatuses.find((s) => s.value === order.status)
                            ?.color
                        }`}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">تفاصيل الطلب</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">
                      معلومات العميل
                    </h3>
                    <p>الاسم: {selectedOrder.customerName}</p>
                    <p>الهاتف: {selectedOrder.phoneNumber}</p>
                    <p>العنوان: {selectedOrder.address}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">
                      معلومات المنتج
                    </h3>
                    <div className="flex items-center">
                      <img
                        src={selectedOrder.product.image}
                        alt={selectedOrder.product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="mr-4">
                        <p className="font-medium">
                          {selectedOrder.product.name}
                        </p>
                        <p className="text-gray-500">
                          {selectedOrder.selectedOffer.name} -{' '}
                          {selectedOrder.selectedOffer.price} د.ج
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">
                      معلومات الطلب
                    </h3>
                    <p>
                      رقم الطلب:{' '}
                      <span className="font-mono">{selectedOrder._id}</span>
                    </p>
                    <p>
                      التاريخ:{' '}
                      {format(new Date(selectedOrder.createdAt), 'PPpp', {
                        locale: ar,
                      })}
                    </p>
                    <p>المبلغ الإجمالي: {selectedOrder.totalAmount} د.ج</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
