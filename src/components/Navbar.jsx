import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../authContext/authContext";
import axios from "axios";
import "../css/Navbar.css";

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const [navbarText, setNavbarText] = useState(
    "THE PREMIER LEAGUE PREDICTOR MODULE"
  );
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  const token = localStorage.getItem("jwtToken");

  const burgerMenuRef = useRef(null);
  const navbarMenuRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

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
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setMenuActive(false);
    }, 200);
  };

  const handleUpdateResults = async () => {
    try {
      // Make a GET request to the backend route
      await axios.get(
        "https://eplbackend.adaptable.app/api/results/updateResults",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Match results updated successfully.");
    } catch (error) {
      console.error("Error updating results:", error);
      alert("Error updating results.");
    }
  };

  const handleUpdateScores = async () => {
    try {
      await axios.put(
        "https://eplbackend.adaptable.app/api/updateScores",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("User scores updated successfully.");
    } catch (error) {
      console.error("Error updating scores:", error);
      alert("Error updating scores.");
    }
  };

  console.log("User context in Navbar:", { isLoggedIn, user }); // Debugging

  return (
    <div className="navbar">
      <img src={"/icons/predict.png"} alt="Predictor Icon" />
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
              <Link to="/about" onClick={toggleMenu}>
                App Info
              </Link>
            </li>
            <li className="menu-list-item">
              <Link to="/rules" onClick={toggleMenu}>
                Rules
              </Link>
            </li>

            {/* Admin buttons */}
            {user?.role === "admin" && (
              <>
                <li className="menu-list-item">
                  <button
                    className="update-button"
                    onClick={handleUpdateResults}
                  >
                    Update Results
                  </button>
                </li>
                <li className="menu-list-item">
                  <button
                    className="update-button"
                    onClick={handleUpdateScores}
                  >
                    Update Scores
                  </button>
                </li>
              </>
            )}

            <li className="menu-list-item">
              <Link to="/logout" onClick={logOutUser}>
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
