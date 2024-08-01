import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../authContext/authContext";
import { useNavigate } from "react-router-dom";

//css
import "../css/Forms.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, authError, isLoading, isLoggedIn } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginUser(email, password);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/base");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="auth-container">
      <div className="animation-container-log">
        <img src="/gifs/stadium.gif" alt="Animation" />
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="auth-btn" type="submit" disabled={isLoading}>
          {isLoading ? "LOGGING..." : "LOGIN"}
        </button>
        {authError && <p className="error">{authError}</p>}
      </form>
    </div>
  );
}

export default Login;
