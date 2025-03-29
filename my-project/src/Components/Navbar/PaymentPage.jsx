import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../Contexts/CartContext';
import { motion } from 'framer-motion';

const PaymentPage = () => {
    const { state } = useLocation(); // Get cartItems from the previous page
    const cartItems = state?.cartItems || [];
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // New email state
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({}); // State to store error messages

    // Calculate the total price of cart items
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = String(item.price).replace('$', ''); // Convert price to string and remove dollar sign
            const priceValue = parseFloat(price); // Convert to number
            return total + priceValue * item.quantity;
        }, 0).toFixed(2);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset errors before checking
        setErrors({});

        // Check if any field is empty
        const newErrors = {};
        if (!name) newErrors.name = 'Full Name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!cardNumber) newErrors.cardNumber = 'Card Number is required';
        if (!expiryDate) newErrors.expiryDate = 'Expiry Date is required';
        if (!cvv) newErrors.cvv = 'CVV is required';

        if (Object.keys(newErrors).length > 0) {
            // If there are errors, set them in the state
            setErrors(newErrors);
            return; // Prevent form submission
        }

        // Prepare the payment data
        const paymentData = {
            name,
            email,
            cardNumber,
            expiryDate,
            cvv,
            cartItems,
            totalAmount: calculateTotal(),
        };

        // Payment is successful
        clearCart(); // Clear the cart

        // Show a success alert
        alert('Payment Successful!');

        // Pass payment data to Dashboard using state and navigate
        navigate('/dashboard', { state: paymentData });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 100 }}
             transition={{ duration: 0.6 }}className="container mx-auto p-8 w-[400px] bg-white rounded-xl shadow-lg relative max-h-[80vh] overflow-y-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/cart')} 
                    className="absolute w-10 top-4 right-4 text-white bg-red-500 hover:bg-red-600 p-2 mt-0 mr-0 rounded-xl"
                >
                    X
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-center">Payment Information</h2>

                {/* Display cart items */}
                {cartItems.length > 0 ? (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Your Order</h3>
                        {cartItems.map(item => {
                            const price = String(item.price).replace('$', ''); // Convert price to string and remove dollar sign
                            const priceValue = parseFloat(price); // Convert to number
                            return (
                                <div key={item.id} className="flex justify-between mb-2">
                                    <span>{item.title} x{item.quantity}</span>
                                    <span>${(priceValue * item.quantity).toFixed(2)}</span>
                                </div>
                            );
                        })}
                        <div className="flex justify-between mb-4 font-bold">
                            <span>Total</span>
                            <span>${calculateTotal()}</span>
                        </div>
                    </>
                ) : (
                    <p>No items in the cart.</p>
                )}

                {/* Payment form */}
                <motion.form
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 100 }}
                 transition={{ duration: 0.6 }} 
                onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className={`mt-2 p-3 w-full border rounded-md transition-all duration-300 
                                        ${errors.name ? 'border-red-500' : 'border-gray-300'} 
                                        focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className={`mt-2 p-3 w-full border rounded-md transition-all duration-300 
                                        ${errors.email ? 'border-red-500' : 'border-gray-300'} 
                                        focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
                        <input
                            type="text"
                            id="card-number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Enter your card number"
                            className={`mt-2 p-3 w-full border rounded-md transition-all duration-300 
                                        ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} 
                                        focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="mb-4 flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input
                                type="text"
                                id="expiry"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                placeholder="MM/YY"
                                className={`mt-2 p-3 w-full rounded-md transition-all duration-300 
                                            ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} 
                                            focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>

                        <div className="w-1/2">
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="CVV"
                                className={`mt-2 p-3 w-full rounded-md transition-all duration-300 
                                            ${errors.cvv ? 'border-red-500' : 'border-gray-300'} 
                                            focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="submit"
                            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Submit Payment
                        </button>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default PaymentPage;
