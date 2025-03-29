import React, { useContext } from 'react';
import { IoIosHome } from "react-icons/io";
import { MdMenu, MdOutlineShoppingCart } from "react-icons/md";
import ResponsiveMenu from './ResponsiveMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../Contexts/CartContext';
import { motion } from 'framer-motion'

const NavbarMenu = [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "Product", link: "/products" },
    { id: 3, title: "About", link: "/about" },
    { id: 4, title: "Contacts", link: "#" },
];

const Navbars = () => {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { itemCount } = useContext(CartContext); // Access itemCount from CartContext

    return (
        <>
        <nav
            className="fixed top-0 left-0 w-full bg-white z-50 shadow-xs"
            style={{ backdropFilter: "blur(10px)" }} // Optional: Add a slight blur effect for aesthetics
        >
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
                                        ${location.pathname === menu.link ? 'text-green-700' : 'hover:text-green-600'}
                                        hover:shadow-[0_3px_0_-1px_#2f855a]`}
                                >
                                    {menu.title}
                                </a>
                            </li>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            onClick={() => navigate('/cart')}
                            className="relative text-3xl hover:bg-green-700 hover:text-white rounded-full duration-200"
                        >
                            <MdOutlineShoppingCart />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </motion.button>
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
