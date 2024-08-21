import React from "react";
import "../css/Popup.css"; // Ensure you have appropriate styling

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-button" onClick={onClose}>
          &times;
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;
