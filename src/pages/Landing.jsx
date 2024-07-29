import React from "react";
import { useNavigate } from "react-router-dom";

//css
import "../css/Forms.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Navigate to Login page
  };

  const handleRegister = () => {
    navigate("/register"); // Navigate to Register page
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <button className="auth-btn" onClick={handleLogin}>
          LOGIN
        </button>
        <button className="auth-btn" onClick={handleRegister}>
          REGISTER
        </button>
      </div>
    </div>
  );
};

export default Landing;
