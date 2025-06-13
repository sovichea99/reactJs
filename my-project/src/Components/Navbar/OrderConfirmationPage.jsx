import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Service/api.jsx";

const OrderConfirmationPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) throw new Error("Not authenticated");

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload.sub;

        const response = await api.get(`/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.length > 0) {
          setOrders(response.data);
        } else {
          setError("No orders found");
        }
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-8 text-lg font-medium text-gray-600 animate-pulse">
        Loading your orders...
      </div>
    );
  }

  if (error || orders.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="container mx-auto p-6 w-full max-w-md bg-white rounded-xl shadow-2xl text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Oops!</h2>
          <p className="text-gray-700">
            {error || "Could not find any order details."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 py-2 px-5 bg-green-500 hover:bg-green-600 transition-all duration-200 text-white rounded-md"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    // Main modal overlay
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      {/* --- STEP 1: Main modal container is now a flex column --- */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* --- STEP 2: Sticky Header --- */}
        {/* `flex-shrink-0` prevents this section from shrinking */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            🛍️ Your Order History
          </h2>
        </div>
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 scroll-smooth">
          {orders.map((order) => (
            <div
              key={order.id}
              className="mb-8 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50"
            >
              <div className="p-4 border-b border-gray-200 text-xs sm:text-sm text-gray-600 grid grid-rows-2 sm:grid-rows-3 gap-2">
                <p>
                  <span className="font-semibold text-gray-700">Order ID:</span>{" "}
                  #{order.id?.toString().substring(18)}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Date:</span>{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Status:</span>{" "}
                  <span className="font-medium text-blue-600">
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="p-4 space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 bg-white rounded-lg p-3 border"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url || "/placeholder-product.png"}
                        alt={item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md border"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-gray-500">
                          Price: ${item.price}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-semibold text-gray-800 text-sm sm:text-base">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 text-right">
                <div className="flex justify-end items-baseline gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Order Total:
                  </span>
                  <span className="text-lg font-bold text-red-500">
                    ${parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- STEP 4: Sticky Footer --- */}
        {/* `flex-shrink-0` prevents this section from shrinking */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end flex-shrink-0">
          <button
            onClick={() => navigate("/")}
            className="py-2 px-5 bg-green-500 hover:bg-green-600 transition-all text-white font-medium rounded-md text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
