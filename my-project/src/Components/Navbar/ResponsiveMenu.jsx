import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Fadeup } from "../../ultility/animation";
import { MdClose } from "react-icons/md"; // Import close icon
import { getCurrentUser } from "../../Service/Auth";
import { FiLogOut, FiShoppingBag, FiUser, FiUserPlus } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import PropTypes from "prop-types";
const ResponsiveMenu = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
  }, []);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    setUser(null); // Clear user state
    navigate("/login");
  };
  /*const profileMenu = [
    { title: "Orders", link: "/orders", icon: <MdOutlineShoppingCart /> },
    user && user.email
      ? { title: "Logout", action: "logout", icon: <FiLogOut /> }
      : { title: "Login / Register", link: "/register", icon: <FiUserPlus /> },
  ];*/
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
          className="fixed inset-0 z-50 bg-green-900 bg-opacity-65 backdrop-blur-sm"
        >
          {/* Cancel Button */}
          <div className="absolute  top-5 right-[20px]">
            <button onClick={() => setOpen(false)} className="text-3xl">
              <MdClose className="text-white hover:text-gray-200" />
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
                { title: "Home", path: "/" },
                { title: "Product", path: "/products" },
                { title: "My Cart", path: "/cart" },
                { title: "About Us", path: "/about" },
                { title: "Contact Us", path: "/contact" },
              ].map((item) => (
                <li
                  key={item.title}
                  onClick={() => handleNavigation(item.path)}
                  className={`cursor-pointer ${
                    location.pathname === item.path
                      ? "text-green-500"
                      : "text-white"
                  } hover:text-green-300`}
                >
                  {item.title}
                </li>
                //Auth section
              ))}
              {/* Profile Icon + Dropdown Toggle */}
              <li
                className="cursor-pointer flex items-center gap-2 relative"
                ref={dropdownRef}
              >
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  // The parent div only needs to be a clickable `group`. The color logic belongs on the children.
                  className="flex items-center gap-1 cursor-pointer group"
                >
                  <FiUser
                    // 1. Use `className={...}` to start a JavaScript expression.
                    // 2. Use backticks `` ` `` inside the braces to build the string.
                    className={`text-3xl transition-colors duration-200 ${
                      // 3. The ternary operator now works correctly.
                      showDropdown
                        ? "text-green-500"
                        : "text-white group-hover:text-green-300"
                    }`}
                  />
                  <IoIosArrowDown
                    className={`transition-all duration-200 ${
                      // Apply the same logic to the arrow so it also changes color.
                      showDropdown
                        ? "rotate-180 text-green-500"
                        : "text-white group-hover:text-green-300"
                    }`}
                  />
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <ul className="absolute top-full justify-center left-[-55px] items-center mt-3 min-w-[220px] py-2 z-50">
                    {user ? (
                      <>
                        <li
                          onClick={() => handleNavigation("/orders")}
                          className=" text-white hover:text-green-300 px-4 w-full py-2 rounded-md flex items-center gap-2  cursor-pointer"
                        >
                          <FiShoppingBag className="w-6 h-6 flex-shrink-0" />{" "}
                          <span>Orders</span>
                        </li>
                        <li
                          onClick={handleLogout}
                          className=" hover:text-red-400 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2"
                        >
                          <FiLogOut /> <span>Logout</span>
                        </li>
                      </>
                    ) : (
                      <li
                        onClick={() => handleNavigation("/register")}
                        className="hover:bg-green-100 px-4 py-2 rounded-md cursor-pointer flex items-center gap-2"
                      >
                        <FiUserPlus /> <span>Login / Register</span>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            </motion.ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
ResponsiveMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
export default ResponsiveMenu;
