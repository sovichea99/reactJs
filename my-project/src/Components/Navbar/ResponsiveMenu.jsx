import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Fadeup } from '../../ultility/animation';
import { MdClose } from 'react-icons/md'; // Import close icon

const ResponsiveMenu = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle navigation and close the menu
  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false); // Close menu after navigation
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-green-900 bg-opacity-60 backdrop-blur-sm"
        >
          {/* Cancel Button */}
          <div className="absolute top-4 right-4">
            <button onClick={() => setOpen(false)} className="text-3xl">
              <MdClose className= "text-white hover:text-gray-200" />
            </button>
          </div>

          {/* Menu content */}
          <div className="flex items-center justify-center h-full">
            <motion.ul
              variants={Fadeup(0.1)}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-8 text-2xl font-semibold uppercase"
            >
              {/* Menu items with navigation and active link highlighting */}
              {[
                { title: 'Home', path: '/' },
                { title: 'Product', path: '/products' },
                { title: 'My Cart', path: '/cart' },
                { title: 'About Us', path: '/about' },
                { title: 'Contact', path: '/contact' }
              ].map((item) => (
                <li
                  key={item.title}
                  onClick={() => handleNavigation(item.path)}
                  className={`cursor-pointer ${
                    location.pathname === item.path ? 'text-green-500' : 'text-white'
                  } hover:text-green-300`}
                >
                  {item.title}
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
