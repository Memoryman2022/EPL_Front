import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext/authContext";

//css
import "../css/Forms.css";

const Landing = () => {
  const navigate = useNavigate();
  const { logInGuest } = useContext(AuthContext);

  const handleLogin = () => {
    navigate("/login"); // Navigate to Login page
  };

  // const handleRegister = () => {
  //   navigate("/register"); // Navigate to Register page
  // };
  const handleGuest = () => {
    logInGuest(); // Log the user in as a guest
    navigate("/base"); // Navigate to Base page
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <button className="auth-btn" onClick={handleLogin}>
          LOGIN
        </button>
        <button className="auth-btn" onClick={handleGuest}>
          REGISTER
        </button>
      </div>
    </div>
  );
};

export default Landing;
