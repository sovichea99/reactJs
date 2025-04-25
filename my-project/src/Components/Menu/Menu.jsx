import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FadeLeft } from '../../ultility/animation';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../Contexts/CartContext';
import { MdOutlineShoppingCart } from "react-icons/md"; // Import the cart icon

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext); // Access the CartContext to add products to cart

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/'); // Use the same API as in Products
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Slice the first 4 products for the menu
  const displayedProducts = products.slice(0, 4);

  return (
    <section>
      <div className="container lg:w-full pt-1 pb-2">
        <motion.h1
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl font-bold text-left pb-10 uppercase"
        >
          Our Menu
        </motion.h1>
        <div className="grid grid-cols-1 lg:m-auto lg:w-[100%] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-8 md:gap-10 justify-items-center">
          {displayedProducts.map((product) => (
            <motion.div
              variants={FadeLeft(product.id % 1 )} // Adding slight animation variation
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.08 }}
              key={product.id}
              className="relative bg-white w-[220px] rounded-3xl px-4 py-4 shadow-[0_0_22px_0_rgba(0,0,0,0.15)] flex flex-col items-center"
            >
              <Link to={`/product/${product.id}`}>
                <motion.div>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-[80px] h-[80px] object-cover -translate-y-6 scale-150 mb-4"
                  />
                  <div className="text-center">
                    <h1 className="text-lg font-semibold">{product.name}</h1>
                    <p className="text-lg font-semibold text-orange-400">${product.price}</p>
                  </div>
                </motion.div>
              </Link>

              {/* Small Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                onClick={() => addToCart(product)} // Add product to cart
                className="absolute bottom-3 right-3 bg-green-500 text-white p-2 rounded-full hover:bg-green-700"
              >
                <MdOutlineShoppingCart size={20} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Show More Link - Positioned below the products */}
        <div className="text-center mt-6">
          <Link
            to="/products" // Navigate to the Products page when clicked
            className="text-green-500 text-md font-semibold hover:text-green-700"
          >
            --{'>'} show more products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Menu;
