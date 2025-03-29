import React from 'react';
import { CiShop } from "react-icons/ci";
import SofaImage from '../../assets/Sofa.png';
import { motion } from 'framer-motion';
import { FadeLeft, FadeRight } from '../../ultility/animation';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Menu from '../Menu/Menu';
import Footer from './Footer';

const Homes = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Handle "Shop Now" button click
  const handleShopNowClick = () => {
    navigate('/products'); // Navigate to the Products page
  };

  return (
    <>
      <section>
        <div className='container grid grid-cols-1 md:grid-cols-2 min-h-[650px]'>
          {/* Brand Info */}
          <div className='flex flex-col justify-center py-14 md:py-0 relative z-10'>
            <div className='text-center md:text-left space-y-6 lg:max-w-[400px]'>
              <motion.h1
                variants={FadeRight(0.6)}
                initial="hidden"
                animate="visible"
                className='text-3xl lg:text-4xl font-bold leading-relaxed xl:leading-loose font-averia'>
                <span className='text-green-600'>Furnish</span> Your Dream
                <br /><span className='text-secondary'>Home</span> with Us
              </motion.h1>
              <motion.p
                variants={FadeRight(0.7)}
                initial="hidden"
                animate="visible"
                className='text-gray-500'>
                Your Destination for Quality Furniture: Shop Our Curated Selection of Modern and Classic Pieces for Every Room, Combining Style, Function, and Comfort to Perfectly Suit Your Lifestyle.
              </motion.p>
              {/* Button Section */}
              <motion.div
                variants={FadeRight(0.8)}
                initial="hidden"
                animate="visible"
                className='flex justify-center md:justify-start'>
                <button
                  onClick={handleShopNowClick} // Trigger navigation on button click
                  className='primary-btn flex items-center gap-2'>
                  <span>
                    <CiShop />
                  </span>
                  Shop Now
                </button>
              </motion.div>
            </div>
          </div>
          {/* Images */}
          <div className='flex justify-center items-center'>
            <motion.img
              variants={FadeLeft(0.6)}
              initial="hidden"
              animate="visible"
              src={SofaImage} alt=""
              className='w-[300px] md:w-[550px]'
            />
          </div>
        </div>
        <div>
          <Menu />
        </div>
        <div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default Homes;
