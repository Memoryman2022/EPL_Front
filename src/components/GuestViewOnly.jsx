import React from "react";
import { useNavigate } from "react-router-dom";

const GuestViewOnly = () => {
  const navigate = useNavigate();

  const handleNavigateToBase = () => {
    navigate("/base"); // Navigate to the /base route
  };

  return (
    <div>
      <h4>GUEST VIEW ONLY</h4>
      <p>
        You are currently logged in as a guest. You can browse the site but
        cannot perform any actions like editing or deleting content.
      </p>
      <button onClick={handleNavigateToBase}>To Base</button>
    </div>
  );
};

export default GuestViewOnly;
