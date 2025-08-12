// FixtureCalendar.js
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/Calendar.css";
import { useNavigate } from "react-router-dom";
import { useMatchDays } from "../context/MatchDayContext"; // Import the custom hook

const localizer = momentLocalizer(moment);

function FixtureCalendar() {
  const { matchDays, loading, error } = useMatchDays(); // Use the custom hook
  const navigate = useNavigate();

  const handleDayClick = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    if (matchDays[formattedDate]) {
      navigate(`/fixtures/${formattedDate}`);
    }
  };

  const CustomDayWrapper = ({ children, value }) => {
    const formattedDate = moment(value).format("YYYY-MM-DD");
    const hasFixtures =
      matchDays[formattedDate] && matchDays[formattedDate].length > 0;
    const isCurrentDay = moment(value).isSame(moment(), "day");

    return (
      <div
        className={`custom-day-wrapper ${isCurrentDay ? "current-day" : ""} ${
          hasFixtures ? "has-fixtures" : ""
        }`}
        onClick={() => handleDayClick(value)}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: hasFixtures ? "pointer" : "default",
        }}
      >
        {hasFixtures ? "Match Day" : children}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching fixtures</p>;

  return (
    <div className="tab-container">
      <div className="fixture-calendar-wrapper">
        <div className="fixture-calendar">
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={[]} // Clear events from calendar display
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              components={{
                dateCellWrapper: CustomDayWrapper,
              }}
              views={[Views.MONTH]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixtureCalendar;
