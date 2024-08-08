import React, { useState, useEffect } from "react";
import { truncateTeamName } from "../../utils/truncateTeamName";

const ResponsiveTeamName = ({ name }) => {
  const [truncatedName, setTruncatedName] = useState(name);

  useEffect(() => {
    // Always apply the truncation
    setTruncatedName(truncateTeamName(name));
  }, [name]);

  return <span>{truncatedName}</span>;
};

export default ResponsiveTeamName;
