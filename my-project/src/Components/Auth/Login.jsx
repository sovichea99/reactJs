import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosHome } from "react-icons/io";
import { CartContext } from "../../Contexts/CartContext"; // Adjust the import path as necessary
import { userLogin } from "../../Service/Auth"; // Adjust the import path as necessary
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loadUserCart } = useContext(CartContext); // Assuming you have a CartContext to manage cart state


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userLogin({ email, password });
      const { access_token, user } = response;

      if (!access_token || !user) {
        alert("Invalid login response!");
        return;
      }

      // 1. Store the token and user data
      sessionStorage.setItem("authToken", access_token);
      sessionStorage.setItem("user", JSON.stringify(user));
      
      // 2. Call the context function to load data into React's state
      await loadUserCart(); 
      
      // 3. Navigate the user
      navigate("/"); 

    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="items-center justify-center">
      <div className="text-2xl flex items-center justify-center space-x-1 font-bold pb-5">
          <p className="text-green-600 ">Furniture</p>
          <p className="text-orange-400 ">Store</p>
          <IoIosHome className="text-green-600 " />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md lg:w-96 md:w-90 sm:w-88 w-80">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-green-600
                focus:ring-1 focus:ring-green-600" 
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-green-600
                focus:ring-1 focus:ring-green-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Login
            </button>
            <p className="text-center text-gray-600 mt-4">
              <span>Don`t have an account?</span>{" "}
              <Link to="/register" className="text-green-600 hover:underline">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
