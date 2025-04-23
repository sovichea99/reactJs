import React, { useContext, useState, useRef, useEffect } from "react";
import { IoIosHome, IoIosArrowDown } from "react-icons/io";
import { MdMenu, MdOutlineShoppingCart } from "react-icons/md";
import { FiUser,  FiSettings, FiLogOut, FiUserPlus  } from "react-icons/fi";
import ResponsiveMenu from "./ResponsiveMenu";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../Contexts/CartContext";
import { motion } from "framer-motion";
import { getCurrentUser } from "../../Service/Auth"; // Adjust the import path as necessary


const NavbarMenu = [
  { id: 1, title: "Home", link: "/" },
  { id: 2, title: "Product", link: "/products" },
  { id: 3, title: "About", link: "/about" },
  { id: 4, title: "Contacts", link: "#" },
];


const Navbars = () => {
  const [open, setOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useContext(CartContext);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const profileMenu = [
    { title: "My Profile", link: "/profile", icon: <FiUser /> },
    { title: "Orders", link: "/orders" , icon: <MdOutlineShoppingCart/>},
    { title: "Settings", link: "/settings", icon: <FiSettings /> },
      user && user.email ? {title: "Logout", link: "/login", icon: <FiLogOut/> } : {title: "Register", link: "/register", icon: <FiUserPlus/> },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white z-50 shadow-xs">
        <div className="container flex justify-between items-center py-4 md:pt-4">
          <div className="text-2xl flex items-center gap-2 font-bold uppercase">
            <p className="text-green-600">Furniture</p>
            <p className="text-secondary">Store</p>
            <IoIosHome className="text-green-600" />
          </div>

          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-600">
              {NavbarMenu.map((menu) => (
                <li key={menu.id} className="text-xl">
                  <a
                    href={menu.link}
                    className={`inline-block py-1 px-3 font-semibold 
                                            ${
                                              location.pathname === menu.link
                                                ? "text-green-700"
                                                : "hover:text-green-600"
                                            }
                                            `}
                  >
                    {menu.title}
                  </a>
                </li>
              ))}

              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                onClick={() => navigate("/cart")}
                className="relative text-2xl hover:bg-green-700 hover:text-white rounded-full duration-200 p-1"
              >
                <MdOutlineShoppingCart />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </motion.button>

              {/* Profile Dropdown */}
              <li className="relative" ref={profileRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-green-600 ml-4"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center relative">
                    {/* Replace with user image if available */}
                    <FiUser className="text-xl text-green-700" />
                    {/* Alternatively show user initials */}
                    {/* <span className="font-semibold text-green-700">JD</span> */}
                  </div>
                  <IoIosArrowDown
                    className={`transition-transform duration-200 ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-100"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                       {}{user ? user.name : "Guest"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email || "Guest account"}</p>
                    </div>
                    {profileMenu.map((item, index) => (
                      <a
                        key={index}
                        href={item.link}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.link);
                          setShowProfileDropdown(false);
                        }}
                      >
                        <div>
                          {/* {item.icon} 
                          {item.title} */}
                          <span className="text-base flex items-center">{item.icon}</span>
                          <span>{item.title}</span>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </li>
            </ul>
          </div>

          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <MdMenu className="text-4xl" />
          </div>
        </div>
      </nav>

      <ResponsiveMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbars;
