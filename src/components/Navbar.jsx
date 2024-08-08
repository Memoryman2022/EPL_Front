import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../authContext/authContext";
import "../css/Navbar.css";

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const [navbarText, setNavbarText] = useState(
    "THE PREMIER LEAGUE PREDICTOR MODULE"
  );

  const { isLoggedIn, user, authenticateUser } = useContext(AuthContext);

  // Refs for the burger menu and the navbar menu
  const burgerMenuRef = useRef(null);
  const navbarMenuRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  useEffect(() => {
    if (isLoggedIn && !user) {
      authenticateUser();
    }
  }, [isLoggedIn, user, authenticateUser]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 400) {
        setNavbarText("PREDICTOR MODULE");
      } else if (window.innerWidth <= 560) {
        setNavbarText("THE EPL PREDICTOR MODULE");
      } else {
        setNavbarText("THE PREMIER LEAGUE PREDICTOR MODULE");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on current window size
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    // Clear any existing timeout to prevent the menu from hiding
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    // Set a timeout to hide the menu after a delay
    hideTimeoutRef.current = setTimeout(() => {
      setMenuActive(false);
    }, 200); // Adjust delay as needed (e.g., 200ms)
  };

  return (
    <div className="navbar">
      <img src={"/icons/predict.png"} />
      <p>{navbarText}</p>
      <div
        className="burger-menu"
        onClick={toggleMenu}
        onMouseEnter={handleMouseEnter}
        ref={burgerMenuRef}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul
        className={`navbar-menu ${menuActive ? "active" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={navbarMenuRef}
      >
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
