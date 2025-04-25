import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdOutlineShoppingCart } from "react-icons/md";
import { motion } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";
import { CartContext } from '../../Contexts/CartContext';
import axios from 'axios';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`); // Corrected API call
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to fetch product');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        navigate('/cart'); // Navigate to the cart page after adding to cart
    };

    if (loading) {
        return <div>Loading product details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <h2 className="text-center mt-10">Product not found</h2>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                className="relative container w-[350px] mx-auto mt-5 lg:h-[560px] p-4 md:mt-20 md:p-10 lg:w-[600px] sm:w-[480px] sm:h-[550px] h-[430px] bg-white rounded-3xl shadow-[0_0_22px_0_rgba(0,0,0,0.15)]"
            >
                <button
                    onClick={() => navigate('/products')}
                    className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-700 z-10"
                >
                    X
                </button>

                <button
                    onClick={handleAddToCart}
                    className="absolute flex bottom-4 right-5 px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-700 z-10"
                >
                    <FaArrowRight className="mr-2 w-3" /> <MdOutlineShoppingCart />
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 1 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col lg:flex-row items-center lg:items-start"
                >
                    <img
                        src={product.image} // Use the correct image URL field
                        alt={product.title}
                        className="w-[100px] max-w-xs h-auto lg:w-[200px] rounded-lg mb-6 lg:mb-0 lg:mr-10 sm:w-[150px]"
                    />
                    <div className="text-center lg:text-left">
                        <h1 className="text-xl lg:text-1xl lg:mt-10 font-bold mt-[-20px] lg:mb-4">{product.title}</h1>
                        <p className="text-xl lg:text-1xl lg:mb-[-80px] mb-[-30px] font-semibold text-orange-400">{product.price}$</p>
                        <p className="text-xs lg:text-base mt-[-30px] sm:text-[15px] lg:mt-[40px] sm:pt-[35px] pt-10 sm:pb-[10px] text-gray-700 px-4 lg:px-0">
                            {product.description}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ProductDetail;
