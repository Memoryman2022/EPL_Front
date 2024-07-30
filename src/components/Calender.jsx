import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/Calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

function FixtureCalendar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fixturesByDate, setFixturesByDate] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFixtures();
    const intervalId = setInterval(fetchFixtures, 3600000); // Refresh every hour
    return () => clearInterval(intervalId);
  }, []);

  const fetchFixtures = async () => {
    try {
      const response = await axios.get("/api/v4/competitions/2021/matches", {
        headers: {
          "X-Auth-Token": "ab607df2daca41f9963fc2acce71bd52",
        },
      });

      const matches = response.data.matches;

      // Organize fixtures by date
      const fixturesMap = matches.reduce((acc, fixture) => {
        const date = moment(fixture.utcDate).format("YYYY-MM-DD");
        if (!acc[date]) acc[date] = [];
        acc[date].push(fixture);
        return acc;
      }, {});

      setFixturesByDate(fixturesMap);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleDayClick = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    if (fixturesByDate[formattedDate]) {
      navigate(`/fixtures/${formattedDate}`);
    }
  };

  const CustomDayWrapper = ({ children, value }) => {
    const formattedDate = moment(value).format("YYYY-MM-DD");
    const hasFixtures =
      fixturesByDate[formattedDate] && fixturesByDate[formattedDate].length > 0;
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
    <div className="fixture-calendar">
      <div style={{ height: "500px" }}>
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
  );
}

export default FixtureCalendar;
