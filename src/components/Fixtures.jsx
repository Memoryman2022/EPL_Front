import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import ResponsiveTeamName from "../components/ResponsiveTeamName";
import DropdownMenu from "../components/DDP";
import UserPredictions from "../components/UserPredictions";
import MatchResult from "../components/MatchResult";
import { AuthContext } from "../authContext/authContext";
import { API_URL } from "../config/index";

import "../css/Fixtures.css";

function FixtureDetails() {
  const { date } = useParams();
  const { user } = useContext(AuthContext); // Expecting user to have _id
  const [fixtures, setFixtures] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFixtureId, setSelectedFixtureId] = useState(null);

  useEffect(() => {
    fetchFixtures();
    if (user && user._id) {
      fetchPredictions(user._id);
    } else {
      console.warn("User is not logged in or user._id is missing.");
    }
  }, [date, user]);

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
      setError("Failed to fetch fixtures");
      setLoading(false);
    }
  };

  const fetchPredictions = async (userId) => {
    if (!userId) {
      console.error("No userId provided");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(`${API_URL}/predictions/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Predictions response:", response.data);

      if (response.data.length === 0) {
        console.log("No predictions found for the user.");
      }

      const userPredictions = response.data.reduce((acc, prediction) => {
        if (prediction.fixtureId) {
          acc[prediction.fixtureId] = prediction;
        } else {
          console.warn("Prediction missing fixtureId:", prediction);
        }
        return acc;
      }, {});

      setPredictions(userPredictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const handlePredictionClick = (fixtureId) => {
    setOpenDropdown(openDropdown === fixtureId ? null : fixtureId);
    setSelectedFixtureId(fixtureId); // Set the selected fixture ID
  };

  const calculateOutcome = (homeScore, awayScore) => {
    if (homeScore > awayScore) return "homeWin";
    if (homeScore < awayScore) return "awayWin";
    return "draw";
  };

  const handleConfirm = async (fixtureId, homeScore, awayScore) => {
    if (homeScore === "" || awayScore === "") {
      alert("Please enter both home and away scores.");
      return;
    }
    const outcome = calculateOutcome(homeScore, awayScore);
    const userId = user?._id; // Use _id instead of userId

    const payload = {
      fixtureId,
      userId,
      homeScore,
      awayScore,
      outcome,
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(`${API_URL}/predictions`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPredictions((prev) => ({
        ...prev,
        [fixtureId]: { homeScore, awayScore, outcome },
      }));

      setOpenDropdown(null);
    } catch (error) {
      console.error("Error saving prediction:", error);
      alert("Failed to save prediction. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const formattedDate = moment(date).format("DD.MM.YYYY");

  return (
    <div className="fixtures-container">
      <h5>FIXTURES FOR {formattedDate}</h5>
      <ul className="fixtures-list">
        {fixtures.map((fixture) => (
          <React.Fragment key={fixture.id}>
            <li
              className="fixture-item"
              onClick={() => handlePredictionClick(fixture.id)}
            >
              <span className="fixture-time">
                {moment(fixture.utcDate).format("HH:mm")}
              </span>
              <span className="fixture-home">
                <ResponsiveTeamName name={fixture.homeTeam.name} />
              </span>
              <span className="fixture-vs">vs</span>
              <span className="fixture-away">
                <ResponsiveTeamName name={fixture.awayTeam.name} />
              </span>
              <div
                className={`prediction-box ${
                  predictions[fixture.id] ? "confirmed" : ""
                }`}
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
            {selectedFixtureId === fixture.id && (
              <MatchResult fixtureId={fixture.id} />
            )}
            {openDropdown === fixture.id && (
              <li className="dropdown-container">
                {!predictions[fixture.id] ? (
                  <DropdownMenu
                    isOpen={openDropdown === fixture.id}
                    onClose={() => setOpenDropdown(null)}
                    fixture={{ ...fixture, image: "/icons/predict.png" }}
                    onConfirm={handleConfirm}
                  />
                ) : (
                  <div className="user-prediction-dropdown">
                    <UserPredictions fixtureId={fixture.id} />
                  </div>
                )}
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default FixtureDetails;
