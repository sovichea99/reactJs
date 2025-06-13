// src/pages/Orders.jsx

import { useEffect, useState } from 'react';
import api from '../services/api';
import StatusUpdater from '../components/StatusUpdater'; // Make sure this path is correct
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Orders() {
   const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    isLoading: true,
    error: null,
  });

  const fetchDashboardData = async () => {
    try {
      setStats((prev) => ({ ...prev, isLoading: true, error: null }));

      const [statsRes, ordersRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/recent-orders"),
      ]);
      console.log("Stats Response:", statsRes.data);

      setStats({
        totalOrders: statsRes.data.totalOrders,
        totalProducts: statsRes.data.totalProducts,
        totalCustomers: statsRes.data.totalCustomers,
        totalRevenue: statsRes.data.totalRevenue || 0,
        recentOrders: ordersRes.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Failed to load dashboard data",
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (stats.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-lg p-1 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <button
          onClick={fetchDashboardData}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-1">
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {/* Shorten the MongoDB ID for better display */}#
                            {order._id?.toString().substring(18)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.user?.name || (order.user_id ? "Customer" : "Guest")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                            ${(order.total || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* 
                  This is the interactive StatusUpdater component.
                  It replaces the static status span.
                */}
                            <StatusUpdater
                              order={order}
                              onStatusChange={(updatedOrder) => {
                                // This callback function ensures the UI updates instantly
                                // without needing a full page refresh. It finds the order
                                // in the current state and replaces it with the updated version
                                // returned from the API.
                                setStats((prev) => ({
                                  ...prev,
                                  recentOrders: prev.recentOrders.map((o) =>
                                    o._id === updatedOrder._id ? updatedOrder : o
                                  ),
                                }));
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {stats.recentOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No recent orders found
                    </div>
                  )}
                </div>
              </div>
      </div>
      {/* ... Pagination Controls ... */}
    </div>
  );
}