import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/Calendar.css";

const localizer = momentLocalizer(moment);

function FixtureCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchFixtures();
    const intervalId = setInterval(fetchFixtures, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchFixtures = async () => {
    try {
      const response = await axios.get("YOUR_API_ENDPOINT");
      const fixtureEvents = response.data.map((fixture) => ({
        title: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
        start: new Date(fixture.date),
        end: new Date(fixture.date),
        allDay: true,
        resource: fixture.id,
      }));
      setEvents(fixtureEvents);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  const handleDayClick = (date) => {
    console.log("Clicked date:", date);
    // You can add more functionality here, like opening a modal with fixtures for this day
  };

  const handleRefresh = () => {
    fetchFixtures();
  };

  const CustomDayWrapper = ({ children, value }) => {
    const isCurrentDay = moment(value).isSame(moment(), "day");
    return (
      <div
        className={`custom-day-wrapper ${isCurrentDay ? "current-day" : ""}`}
        onClick={() => handleDayClick(value)}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="fixture-calendar">
      <button onClick={handleRefresh} className="refresh-button">
        Refresh Fixtures
      </button>
      <div style={{ height: "500px" }}>
        <Calendar
          localizer={localizer}
          events={events}
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
  );
}

export default FixtureCalendar;
