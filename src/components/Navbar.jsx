import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../authContext/authContext";

//css
import "../css/Navbar.css";

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const { isLoggedIn, user, authenticateUser } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  useEffect(() => {
    if (isLoggedIn && !user) {
      authenticateUser();
    }
  }, [isLoggedIn, user, authenticateUser]);

  return (
    <div className="navbar">
      <img src={"/icons/predict.png"} />
      <p>THE PREMIER LEAGUE PREDICTOR MODULE</p>
      <div className="burger-menu" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
        {isLoggedIn ? (
          <>
            <li className="menu-list-item">
              <Link to={user ? `/user/${user._id}` : "/"} onClick={toggleMenu}>
                User Profile
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/base" onClick={toggleMenu}>
                Central Hub
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/predictions" onClick={toggleMenu}>
                User Predictions
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/final-predictions" onClick={toggleMenu}>
                Confirmed Predictions
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/leaderboard" onClick={toggleMenu}>
                Leaderboard
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/calendar" onClick={toggleMenu}>
                Calendar
              </Link>
            </li>

            <li className="menu-list-item">
              <Link to="/logout" onClick={toggleMenu}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="menu-list-item">
              <Link to="/register" onClick={toggleMenu}>
                REGISTER
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/login" onClick={toggleMenu}>
                LOGIN
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
