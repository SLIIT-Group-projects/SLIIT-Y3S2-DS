import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      switch (response.data.role) {
        case "customer":
          navigate("/customer");
          break;
        case "restaurant":
          navigate("/restaurant");
          break;
        case "delivery":
          navigate("/delivery");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data.message || "Login failed");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg flex overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 bg-orange-100">
          <img
            src="https://img.freepik.com/free-photo/people-taking-photos-food_23-2149303524.jpg?t=st=1745481687~exp=1745485287~hmac=254c09f52230e29104f43bd064ac6c449f89317ac422781b3d7b9bf4b301f919&w=1380"
            alt="Delicious Meal"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">
            Login
          </h2>
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
            <button
              type="submit"
              className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition duration-300 font-semibold"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-black">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-orange-500 hover:underline font-medium"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
