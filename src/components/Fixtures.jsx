import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Import moment library

function FixtureDetails() {
  const { date } = useParams();
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFixtures();
  }, [date]);

  const fetchFixtures = async () => {
    try {
      const response = await axios.get(`/api/v4/competitions/2021/matches`, {
        headers: {
          "X-Auth-Token": "ab607df2daca41f9963fc2acce71bd52",
        },
      });

      const matches = response.data.matches.filter(
        (fixture) => moment(fixture.utcDate).format("YYYY-MM-DD") === date
      );

      setFixtures(matches);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching fixtures</p>;

  return (
    <div>
      <h1>Fixtures on {date}</h1>
      <ul>
        {fixtures.map((fixture) => (
          <li key={fixture.id}>
            {fixture.homeTeam.name} vs {fixture.awayTeam.name} -{" "}
            {moment(fixture.utcDate).format("HH:mm")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FixtureDetails;
