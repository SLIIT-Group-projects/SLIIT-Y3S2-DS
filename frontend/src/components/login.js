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
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("restaurantId", response.data.restaurantId); // Store the restaurant ID


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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="w-full p-2 border rounded-lg" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded-lg" required />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-lg">Login</button>
      </form>

      <p className="mt-4">Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
    </div>
  );
}

export default Login;
