import { useEffect, useState } from 'react';
import { ChartBarIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: []
  });

  // Example static data - replace with API calls
  useEffect(() => {
    // api.get('/dashboard/stats').then(response => setStats(response.data))
    setStats({
      totalOrders: 42,
      totalProducts: 15,
      totalCustomers: 8,
      recentOrders: [
        { id: 1, total: 149.99, status: 'Delivered' },
        { id: 2, total: 89.99, status: 'Processing' }
      ]
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ShoppingBagIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4">#{order.id}</td>
                  <td className="px-6 py-4">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}