import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/auth";
import { IoIosHome } from "react-icons/io";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin({ email, password });
      console.log("Login API Response:", response); // Debugging

      const { access_token, admin } = response;

      if (!access_token || !admin) {
        alert("Invalid login response!");
        return;
      }

      // Store token and admin details in localStorage
      sessionStorage.setItem("authToken", access_token);
      sessionStorage.setItem("admin", JSON.stringify(admin));

      console.log("Stored Admin Data:", sessionStorage.getItem("admin")); // Debugging

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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
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
          </form>
        </div>
      </div>
    </div>
  );
}
