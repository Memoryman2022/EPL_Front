import { useState, useEffect } from "react";
import UserProfile from "../components/Profile";
import Tabs from "../components/Tabs";
import EPL_Table from "../components/EPL_Table";
import Leaderboard from "../components/Leaderboard";
import FixtureCalendar from "../components/Calender";
import FixtureDetails from "../components/Fixtures";
// import UserPoints from "../components/UserPoints";

//css
import "../css/base.css";

function Base() {
  const [tabLabel, setTabLabel] = useState("Premier League Table");
  const [selectedFixtures, setSelectedFixtures] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

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

  const handleDateSelect = (fixtures, date) => {
    setSelectedFixtures(fixtures);
    setSelectedDate(date);
  };

  const tabs = [
    { label: "TABLE", content: <EPL_Table /> },
    { label: "LEADERBOARD", content: <Leaderboard /> },
    {
      label: "CALENDAR",
      content: <FixtureCalendar onDateSelect={handleDateSelect} />,
    },
    
  ];

  return (
    <div className="Base-container">
      <UserProfile UserProfile={UserProfile} />
      <div>
        <Tabs tabs={tabs} />
      </div>
      {selectedFixtures.length > 0 && (
        <FixtureDetails fixtures={selectedFixtures} date={selectedDate} />
      )}
    </div>
  );
}

export default Base;
