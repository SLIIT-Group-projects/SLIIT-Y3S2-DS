import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data.message || "Registration failed");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg flex overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 bg-orange-100">
          <img
            src="https://img.freepik.com/free-photo/high-protein-meal-with-smartphone-arrangement_23-2149089685.jpg?t=st=1745482137~exp=1745485737~hmac=d937d59cab6047a541bfae23454b1f00a3c4925ff9a78368f02f1e2b6068e409&w=740"
            alt="Delicious Meal"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">Register</h2>
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-400"
              required
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-400"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-400"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="delivery">Delivery</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition duration-300 font-semibold"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-black">
            Already have an account?{" "}
            <a href="/login" className="text-orange-500 hover:underline font-medium">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;