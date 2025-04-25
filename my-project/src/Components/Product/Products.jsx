import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FadeLeft } from '../../ultility/animation';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Home/Footer';
import { CartContext } from '../../Contexts/CartContext';
import { MdOutlineShoppingCart } from "react-icons/md"; // Import the cart icon

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/');
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

  const filteredProducts = products.filter(
    (product) => selectedCategory === 'all' || product.category === selectedCategory
  );

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section>
      <div className="container pt-1 pb-2">
        <h1 className="text-center text-2xl font-bold mb-6 pt-28">Our Furniture Products</h1>

        {/* Category Menu */}
        <div className="flex justify-center lg:space-x-16 space-x-2 text-sm mb-10">
          {['all', 'chairs', 'desks', 'sofas'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-lg font-semibold py-1 px-3 ${
                selectedCategory === category ? 'text-green-600' : 'text-gray-700'
              } hover:text-green-600 hover:shadow-[0_3px_0_-1px_#2f855a]`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-8 md:gap-10 justify-items-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
              variants={FadeLeft(product.delay)}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.08 }}
               key={product.id} className="relative bg-white w-[220px] rounded-3xl px-4 py-4 shadow-[0_0_22px_0_rgba(0,0,0,0.15)] flex flex-col items-center">
                <Link to={`/product/${product.id}`}>
                  <motion.div>
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-[80px] h-[80px] object-cover -translate-y-6 scale-150 mb-4"
                    />

                    <div className="text-center">
                      <h1 className="text-lg font-semibold">{product.name}</h1>
                      <p className="text-lg font-semibold text-orange-400">{product.price}$</p>
                    </div>
                  </motion.div>
                </Link>

                {/* Small Add to Cart Button */}
                <motion.button
                whileHover={{ scale: 1.2 }}
                  onClick={() => addToCart(product)}
                  className="absolute bottom-3 right-3 bg-green-500 text-white p-2 rounded-full hover:bg-green-700"
                >
                  <MdOutlineShoppingCart size={20} />
                </motion.button>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found!</p>
          )}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Products;
