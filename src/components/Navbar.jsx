import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../authContext/authContext";

//css
import "../css/Navbar.css";

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const [navbarText, setNavbarText] = useState(
    "THE PREMIER LEAGUE PREDICTOR MODULE"
  );

  const { isLoggedIn, user, authenticateUser } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  useEffect(() => {
    if (isLoggedIn && !user) {
      authenticateUser();
    }
  }, [isLoggedIn, user, authenticateUser]);

  const handleResize = () => {
    if (window.innerWidth <= 400) {
      setNavbarText("PREDICTOR MODULE");
    } else if (window.innerWidth <= 560) {
      setNavbarText("THE EPL PREDICTOR MODULE");
    } else {
      setNavbarText("THE PREMIER LEAGUE PREDICTOR MODULE");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on current window size
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="navbar">
      <img src={"/icons/predict.png"} />
      <p>{navbarText}</p>
      <div className="burger-menu" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
        {isLoggedIn ? (
          <>
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
              <Link to="/confirmed-predictions" onClick={toggleMenu}>
                Confirmed Predictions
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
