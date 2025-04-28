  import React, { useContext } from 'react';
  import { CartContext } from '../../Contexts/CartContext';
  import { MdAdd, MdRemove, MdDelete, MdArrowBack } from 'react-icons/md';
  import { FaRegCreditCard } from 'react-icons/fa';
  import { motion } from 'framer-motion';
  import { useNavigate } from 'react-router-dom';
  import { MdCancel } from "react-icons/md";

  const AddToCart = () => {
    const { cartItems, removeFromCart, decreaseQuantity, increaseQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    // Calculate total price
    const calculateTotal = () => {
      return cartItems.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      ).toFixed(2);
    };

    // Handle Payment click (navigate to payment page)
    const handlePaymentClick = () => {
      navigate('/payment', { state: { cartItems } });
    };

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto w-full max-w-[85%] sm:max-w-[600px] lg:max-w-[550px] bg-white rounded-3xl shadow-lg relative p-6"
        >
          <button
            onClick={() => navigate('/products')}
            className="absolute lg:top-6 md:top-4 sm:top-4 top-5 right-6 px-3 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 focus:outline-none"
          >
            <MdCancel className="text-md lg:text-2xl md:text-xl sm:text-md" />
          </button>

          <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-6 overflow-y-auto max-h-[50vh]">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md"
                  >
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                        <p className="text-orange-500">${item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <MdRemove />
                      </button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <MdAdd />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Proceed to Payment */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-300 pt-4 mt-6">
                <h3 className="text-xl sm:text-2xl font-bold">Total:</h3>
                <span className="text-xl sm:text-2xl font-semibold text-orange-500">${calculateTotal()}</span>
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePaymentClick}
                  className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center justify-center"
                >
                  <FaRegCreditCard className="mr-2" />
                  Proceed to Payment
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  };

  export default AddToCart;
