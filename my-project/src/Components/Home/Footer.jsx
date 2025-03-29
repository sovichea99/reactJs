// src/components/Footer.jsx
import React from 'react';
import { IoIosHome } from "react-icons/io";
import { motion } from 'framer-motion';
import { Fadeup } from '../../ultility/animation';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t-2 border-gray-200 mt-10 ">
      <div className="container mx-auto py-4 flex flex-col lg:flex-row justify-between items-center">
        {/* Brand Section */}
        <motion.div
         variants={Fadeup(0.1)}
         initial="hidden"
         animate="visible" className="text-sm flex items-center gap-2 font-bold uppercase mb-4 lg:mb-0">
          <p className="text-green-600">Furniture</p>
          <p className="text-secondary">Store</p>
          <IoIosHome className="text-green-600" />
        </motion.div>

        {/* Links Section */}
        <motion.div
         variants={Fadeup(0.2)}
         initial="hidden"
         animate="visible"
          className="flex flex-wrap justify-between gap-10 lg:gap-16 w-full lg:w-auto">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-sm font-semibold text-gray-900 uppercase">Resources</h2>
            <ul className="mt-2 text-gray-500 font-medium">
              <li className="mb-2">
                <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
              </li>
              <li>
                <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
              </li>
            </ul>
          </div>
          <div className="mb-6 lg:mb-0">
            <h2 className="text-sm font-semibold text-gray-900 uppercase">Follow us</h2>
            <ul className="mt-2 text-gray-500 font-medium">
              <li className="mb-2">
                <a href="" className="hover:underline">Facebook</a>
              </li>
              <li>
                <a href="" className="hover:underline">Tiktok</a>
              </li>
            </ul>
          </div>
          <div className="mb-6 lg:mb-0">
            <h2 className="text-sm font-semibold text-gray-900 uppercase">Legal</h2>
            <ul className="mt-2 text-gray-500 font-medium">
              <li className="mb-2">
                <a href="#" className="hover:underline">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Terms & Conditions</a>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 py-4">
        © 2024 FurnitureStore™. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
