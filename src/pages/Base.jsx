import React, { useState, useEffect } from "react";
import Leaderboard from "../components/Leaderboard";
import EPL_Table from "../components/EPL_Table";
import FixtureCalendar from "../components/Calender";
import UserProfile from "../components/Profile";
import Tabs from "../components/Tabs";

//css
import "../css/base.css";

function Base() {
  const [tabLabel, setTabLabel] = useState("Premier League Table");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 550) {
        setTabLabel("EPL Table");
      } else {
        setTabLabel("Premier League Table");
      }
    };

    // Set initial tab label based on the current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { label: tabLabel, content: <EPL_Table /> },
    { label: "Leaderboard", content: <Leaderboard /> },
    { label: "Calendar", content: <FixtureCalendar /> },
  ];

  return (
    <div className="Base-container">
      <UserProfile UserProfile={UserProfile} />
      <div>
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}

export default Base;
