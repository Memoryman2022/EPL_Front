// components/ResponsiveTeamName.js
import React, { useState, useEffect } from "react";
import { truncateTeamName } from "../../utils/truncateTeamName";

const ResponsiveTeamName = ({ name }) => {
  const [truncatedName, setTruncatedName] = useState(name);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 725) {
        setTruncatedName(truncateTeamName(name));
      } else {
        setTruncatedName(name);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [name]);

  return <span>{truncatedName}</span>;
};

export default ResponsiveTeamName;
