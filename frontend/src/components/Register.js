import { useState } from "react"; 
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



export default Register;