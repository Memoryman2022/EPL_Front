import React, { useEffect, useRef } from "react";
import ResponsiveTeamName from "../components/ResponsiveTeamName";
import "../css/DDP.css"; // Ensure the CSS file path is correct

function DropdownMenu({ isOpen, onClose, fixture }) {
  const dropdownRef = useRef(null);

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

  return (
    <div ref={dropdownRef} className={`dropdown-menu ${isOpen ? "open" : ""}`}>
      <p>
        INPUT SCORE: <ResponsiveTeamName name={fixture.homeTeam.name} /> vs{" "}
        <ResponsiveTeamName name={fixture.awayTeam.name} />
      </p>
      <button className="close-btn" onClick={onClose}>
        CONFIRM
      </button>
    </div>
  );
}

export default DropdownMenu;
