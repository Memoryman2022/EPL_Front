import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "../css/Fixtures.css"; // Ensure this path is correct for your project

function FixtureDetails() {
  const { date } = useParams();
  const [fixtures, setFixtures] = useState([]);
  const [predictions, setPredictions] = useState({});
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

  const handlePrediction = (fixtureId) => {
    setPredictions((prev) => ({
      ...prev,
      [fixtureId]: !prev[fixtureId],
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching fixtures</p>;

  const formattedDate = moment(date).format("DD.MM.YYYY");

  const removeSuffixes = (teamName) => {
    return teamName.replace(/( FC| AFC)$/, "");
  };

  return (
    <div className="fixtures-container">
      <h4>Fixtures {formattedDate}</h4>
      <ul className="fixtures-list">
        {fixtures.map((fixture) => (
          <li key={fixture.id} className="fixture-item">
            <span className="fixture-time">
              {moment(fixture.utcDate).format("HH:mm")}
            </span>
            <span className="fixture-home">
              {removeSuffixes(fixture.homeTeam.name)}
            </span>
            <span className="fixture-vs">vs</span>
            <span className="fixture-away">
              {removeSuffixes(fixture.awayTeam.name)}
            </span>
            <div
              className={`prediction-box ${
                predictions[fixture.id] ? "confirmed" : ""
              }`}
              onClick={() => handlePrediction(fixture.id)}
            >
              <img
                src={
                  predictions[fixture.id]
                    ? "/icons/lock.png"
                    : "/icons/predict.png"
                }
                alt={predictions[fixture.id] ? "Confirmed" : "Predict"}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FixtureDetails;
