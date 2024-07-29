import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/authContext";
//css
import "../css/Forms.css";

const Logout = () => {
  const { logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // This function is triggered by the button click
  const handleLogout = () => {
    logOutUser(); // Call the logout function from context to remove token and clear session
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <button className="auth-btn" onClick={handleLogout}>
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Logout;
