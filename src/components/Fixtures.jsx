import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMatchDays } from "../context/MatchDayContext";
import { AuthContext } from "../authContext/authContext";
import moment from "moment";
import ResponsiveTeamName from "../components/ResponsiveTeamName";
import DropdownMenu from "../components/DDP";
import UserPredictions from "../components/UserPredictions";
import MatchResult from "../components/MatchResult";
import axios from "axios";
import { API_URL } from "../config";

import "../css/Fixtures.css";

function FixtureDetails() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const {
    matchDays,
    loading: contextLoading,
    error: contextError,
  } = useMatchDays();
  const [fixtures, setFixtures] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFixtureId, setSelectedFixtureId] = useState(null);

  const findNearestDate = (direction) => {
    const dates = Object.keys(matchDays);
    const currentIndex = dates.indexOf(date);
    if (direction === "prev" && currentIndex > 0)
      return dates[currentIndex - 1];
    if (direction === "next" && currentIndex < dates.length - 1)
      return dates[currentIndex + 1];
    return null;
  };

  const handlePrevDate = () => {
    const prevDate = findNearestDate("prev");
    if (prevDate) navigate(`/fixtures/${prevDate}`);
  };

  const handleNextDate = () => {
    const nextDate = findNearestDate("next");
    if (nextDate) navigate(`/fixtures/${nextDate}`);
  };

  useEffect(() => {
    console.log("user is : ", user.userId);
  }, []);

  useEffect(() => {
    if (matchDays[date]) {
      setFixtures(matchDays[date]);
      setLoading(false);
    } else {
      setLoading(contextLoading);
      setError(contextError);
    }

    if (!authLoading && user && user.userId) {
      fetchPredictions(user.userId);
    }
  }, [date, user, matchDays, contextLoading, contextError, authLoading]);

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
    setSelectedFixtureId(fixtureId);
  };

  const calculateOutcome = (homeScore, awayScore) => {
    if (homeScore > awayScore) return "homeWin";
    if (homeScore < awayScore) return "awayWin";
    return "draw";
  };

  const handleConfirm = async (fixtureId, userId, homeScore, awayScore) => {
    if (homeScore === "" || awayScore === "") {
      alert("Please enter both home and away scores.");
      return;
    }
    const outcome = calculateOutcome(homeScore, awayScore);

    const payload = {
      fixtureId,
      userId,
      homeScore: Number(homeScore), // Ensure homeScore is a number
      awayScore: Number(awayScore), // Ensure awayScore is a number
      outcome,
    };

    console.log("Sending payload:", payload); // Log payload for debugging

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(`${API_URL}/predictions`, payload, {
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

  if (loading || authLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const formattedDate = moment(date).format("DD.MM.YYYY");

  return (
    <div className="fixtures-container">
      <div className="navigation-buttons">
        <div className="nav-button nav-prev" onClick={handlePrevDate} />
        <h5>FIXTURES FOR {formattedDate}</h5>
        <div className="nav-button nav-next" onClick={handleNextDate} />
      </div>
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
                    userId={user.userId} // Pass userId to DropdownMenu
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
