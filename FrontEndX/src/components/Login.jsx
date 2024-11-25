import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from './providers/UserContext';
import './login.css'; // Import your CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { userInfo, setUserInfo, userEmail, setuserEmail } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      alert(response.data.message);
      setUserInfo(response.data.user);
      setuserEmail(email)
      navigate("/Verify-otp");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>

        {/* Links for Forgot Password and Register */}
        <div className="login-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/registration">Don't have an account? Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
