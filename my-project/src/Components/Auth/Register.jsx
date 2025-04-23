import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosHome } from "react-icons/io";
const Register = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {name, email, password};

        try{
            const response = await fetch("http://localhost:8000/api/user/register",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if(response.ok){
                alert("Registeration successful!");
                navigate("/login");
            }else{
                alert(data.message|| "Registeration failed!");
            }
        }catch(error){
            console.error("Error during registration:", error);
            alert("Something went wrong while registering!");
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-green-600
                focus:ring-1 focus:ring-green-600"
                required
              />
            </div>
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
              Register
            </button>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
