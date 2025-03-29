import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const location = useLocation();
    const paymentData = location.state; // Get the payment data passed from the PaymentPage
    const navigate = useNavigate();

    // Handle the case when no payment data is available
    if (!paymentData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="container mx-auto p-4 sm:p-6 w-full max-w-sm sm:max-w-md bg-white rounded-lg lg:rounded-xl shadow-lg">
                    <h2 className="text-base sm:text-lg font-semibold mb-4">Error</h2>
                    <p className="text-sm">No payment data available. Please complete the payment first.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 mt-4 text-sm"
                    >
                        Go back to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="container mx-auto p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-xl lg:rounded-xl shadow-lg flex flex-col justify-between">
                <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">Your Receipt</h2>

                {/* Display Payment Details */}
                <div className="mb-4">
                    <h3 className="text-sm sm:text-base font-semibold mb-2">Payment Details</h3>
                    <p className="text-sm"><strong>Name:</strong> {paymentData.name}</p>
                    <p className="text-sm"><strong>Card Number:</strong> {paymentData.cardNumber.replace(/.(?=.{4})/g, '*')}</p>
                    <p className="text-sm"><strong>Email:</strong> {paymentData.email}</p>
                    <p className="text-sm"><strong>Expiry Date:</strong> {paymentData.expiryDate}</p>
                </div>

                <hr className="border-t border-gray-300 my-4" />

                {/* Display Cart Items */}
                <div className="mb-4">
                    <h3 className="text-sm sm:text-base font-semibold mb-2">Order Summary</h3>
                    {paymentData.cartItems && paymentData.cartItems.length > 0 ? (
                        paymentData.cartItems.map((item, index) => {
                            const price = String(item.price); // Remove $ sign
                            return (
                                <div key={index} className="flex justify-between text-sm mb-2">
                                    <span>{item.title} x{item.quantity}</span>
                                    <span>${(parseFloat(price) * item.quantity).toFixed(2)}</span>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm">No items in the cart.</p>
                    )}

                    <div className="flex justify-between mb-4 font-bold text-sm">
                        <span>Total</span>
                        <span>${paymentData.totalAmount}</span>
                    </div>
                </div>

                <hr className="border-t border-gray-300 my-4" />

                {/* Thank you message */}
                <div className="text-center mb-4">
                    <p className="text-sm sm:text-base">Thank you for your purchase!</p>
                    <p className="text-xs text-gray-600">You will receive a confirmation email shortly.</p>
                </div>

                {/* Button to go back to homepage */}
                <div className="flex justify-end mt-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 text-sm"
                    >
                        Go back to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
