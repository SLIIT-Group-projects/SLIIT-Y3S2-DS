/*import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

function Register() { const [username, setUsername] = useState(""); const [password, setPassword] = useState(""); const [role, setRole] = useState("Customer"); const [error, setError] = useState(""); const navigate = useNavigate();

const handleRegister = async (e) => { e.preventDefault(); try { await axios.post("http://localhost:3001/api/users/register", { username, password, role, }); navigate("/login"); } catch (err) { setError(err.response?.data.message || "Registration failed"); } };

return (

Register

{error &&

{error}

}

Username<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded-lg" required />

Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-lg" required />

Role<select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded-lg" > CustomerRestaurantDelivery

 Register

Already have an account?{" "} Login

); }



export default Register;*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/users/register", {
        username,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data.message || "Registration failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Customer">Customer</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg"
        >
          Register
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 underline">
          Login
        </a>
      </p>
    </div>
  );
}

export default Register;
