import React, { useState, useEffect, useRef } from "react";
import "../css/DDP.css"; // Ensure the CSS file path is correct

function DropdownMenu({ isOpen, onClose, fixture, onConfirm }) {
  const dropdownRef = useRef(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  const handleScoreChange = (team, score) => {
    if (team === "home") {
      setHomeScore(score);
    } else if (team === "away") {
      setAwayScore(score);
    }
  };

  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (isOpen) {
      dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
      dropdown.style.opacity = 1;
    } else {
      dropdown.style.maxHeight = "0";
      dropdown.style.opacity = 0;
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(fixture.id, homeScore, awayScore);
  };

  return (
    <div ref={dropdownRef} className={`dropdown-menu ${isOpen ? "open" : ""}`}>
      <p className="dropdown-text">SCORE INPUT:</p>

      <div className="dropdown-home">
        <input
          type="number"
          className="score-input"
          value={homeScore}
          onChange={(e) => handleScoreChange("home", e.target.value)}
        />
      </div>
      <span className="dropdown-vs">-</span>
      <div className="dropdown-away">
        <input
          type="number"
          className="score-input"
          value={awayScore}
          onChange={(e) => handleScoreChange("away", e.target.value)}
        />
      </div>

      <div className="prediction-box">
        <img
          src={fixture.image}
          alt="Confirm"
          className="confirm-img"
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
}

export default DropdownMenu;
