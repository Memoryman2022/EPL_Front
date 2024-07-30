import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/Calendar.css"; // We'll create this file for custom styles

const localizer = momentLocalizer(moment);

function FixtureCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchFixtures();
    const intervalId = setInterval(fetchFixtures, 3600000); // Fetch every hour
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

  const handleEventClick = (event) => {
    console.log("Clicked event:", event);
    // You can add more functionality here, like opening a modal with fixture details
  };

  const handleRefresh = () => {
    fetchFixtures();
  };

  const customDayPropGetter = (date) => {
    if (moment(date).isSame(moment(), "day")) {
      return {
        className: "current-day",
        style: {
          backgroundColor: "#f0f0f0",
        },
      };
    }
    return {};
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
          onSelectEvent={handleEventClick}
          dayPropGetter={customDayPropGetter}
        />
      </div>
    </div>
  );
}

export default FixtureCalendar;
