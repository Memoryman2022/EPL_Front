import Leaderboard from "../components/Leaderboard";
import EPL_Table from "../components/EPL_Table";
import FixtureCalendar from "../components/Calender";
import UserProfile from "../components/Profile";
import Tabs from "../components/Tabs";

//css

function Base() {
  const tabs = [
    { label: "Premier League Table", content: <EPL_Table /> },
    { label: "Leaderbord", content: <Leaderboard /> },
    { label: "Calender", content: <FixtureCalendar /> },
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
