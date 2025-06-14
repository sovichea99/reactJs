import { useState } from "react";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faBox,
  faTruckFast,
  faBan,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const statusOptions = {
  Processing: { icon: faSpinner, class: "text-yellow-600" },
  Shipped: { icon: faTruckFast, class: "text-orange-400" },
  Delivered: { icon: faBox, class: "text-green-600" },
  Cancelled: { icon: faBan, class: "text-red-600" },
};

export default function StatusUpdater({ order, onStatusChange }) {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
       // ===================================================================
      // THE KEY FIX: Robustly get the order ID
      // It checks for 'id' (from pagination) OR '_id' (from dashboard).
      const orderId = order.id || order._id;
      if (!orderId) {
        throw new Error("Order ID not found");
      }
       // ===================================================================
       const response = await api.put(`orders/${orderId}/status`,{
        status: newStatus
       });
        // The API should return the full, updated order object
        const updateOrder = response.data.order||response.data;
        setCurrentStatus(updateOrder.status);
        // Notify the parent component of the change
        if (onStatusChange){
          onStatusChange(updateOrder);
        }
    }catch(error){
      console.error("Status update failed:", error);
      // Revert the status on the UI if the API call fails
      setCurrentStatus(order.status); 
      
      alert(
        `Status update failed: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusClasses = (status) => {
    const base =
      "px-3 py-2 text-sm font-semibold rounded-md bg-opacity-10 border-2 transition-all";
    const statusStyles = {
      Delivered: "border-green-500 text-green-700 bg-green-100",
      Shipped: "border-orange-400 text-orange-400 bg-orange-100",
      Cancelled: "border-red-500 text-red-700 bg-red-100",
      Processing: "border-grey text-grey-500 bg-grey-100",
    };
    return `${base} ${statusStyles[status] || statusStyles["Processing"]} ${
      isUpdating ? "opacity-70 cursor-not-allowed animate-pulse" : ""
    }`;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Icon next to dropdown */}
      <FontAwesomeIcon
        icon={statusOptions[currentStatus]?.icon || faSpinner}
        spin={currentStatus === "Processing"}
        className={`text-lg ${statusOptions[currentStatus]?.class || "text-gray-600"}`}
      />
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={getStatusClasses(currentStatus)}
        aria-label="Order status"
      >
        {Object.keys(statusOptions).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
