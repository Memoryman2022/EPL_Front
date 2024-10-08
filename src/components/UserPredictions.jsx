import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../authContext/authContext";
import { API_URL } from "../config/index";
import { useMatchDays } from "../context/MatchDayContext";
import Popup from "../components/Popup"; // Ensure you have a Popup component

import "../css/UserPredictions.css";

const getOutcomeLabel = (outcome) => {
  switch (outcome) {
    case "homeWin":
      return "H";
    case "draw":
      return "D";
    case "awayWin":
      return "A";
    default:
      return "Unknown";
  }
};

function UserPredictions({ fixtureId }) {
  const { user, isLoggedIn } = useContext(AuthContext);
  const { matchDays } = useMatchDays(); // Use the context to get match days
  const [predictions, setPredictions] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user && fixtureId) {
      console.log("Fetching predictions for fixtureId:", fixtureId);
      fetchPredictions(fixtureId);
    } else {
      setError("User not authenticated or fixtureId is missing");
      setLoading(false);
    }
  }, [isLoggedIn, user, fixtureId]);

  const fetchPredictions = async (fixtureId) => {
    if (!fixtureId) {
      console.error("No fixtureId provided");
      setError("No fixtureId provided");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${API_URL}/predictions/fixture/${fixtureId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Predictions data:", response.data);

      const predictions = response.data;
      setPredictions(predictions);
      fetchUserProfiles(predictions.map((p) => p.userId));

      // Determine if predictions are closed based on match start time
      const match = Object.values(matchDays)
        .flat()
        .find((m) => m.id === fixtureId);
      if (match) {
        const matchStartTime = new Date(match.utcDate); // Parse the fixture's UTC date
        const now = new Date(); // Current time in UTC
        if (matchStartTime <= now) {
          setShowPopup(true); // Show popup if the match has started
        }
      }
    } catch (error) {
      console.error(
        "Error fetching predictions:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfiles = async (userIds) => {
    if (userIds.length === 0) {
      console.log("No userIds to fetch profiles");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const profiles = {};

      await Promise.all(
        userIds.map(async (userId) => {
          try {
            const response = await axios.get(
              `${API_URL}/users/protected/user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            profiles[userId] = response.data; // Save profile data
          } catch (error) {
            console.error(
              `Error fetching profile for userId ${userId}:`,
              error.response ? error.response.data : error.message
            );
          }
        })
      );

      setUserProfiles(profiles); // Set profiles for all users
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setError("Failed to fetch user profiles");
    }
  };

  const sortedPredictions = predictions.sort((a, b) =>
    a.userId === user.userId ? -1 : 1
  );

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-predictions-container">
      <h4 className="pred-H4">____PREDICTIONS</h4>
      {showPopup && (
        <Popup
          message="Predictions are closed for this fixture."
          onClose={handleClosePopup}
        />
      )}
      {sortedPredictions.length === 0 ? (
        <p>No predictions found for this fixture.</p>
      ) : (
        <ul>
          {sortedPredictions.map((prediction) => (
            <li key={prediction.userId} className="user-prediction-item">
              <div className="prediction-details">
                <div className="user-profile-CP">
                  <img
                    src={
                      userProfiles[prediction.userId]?.profileImage
                        ? `${API_URL.replace("/api", "")}${
                            userProfiles[prediction.userId].profileImage
                          }`
                        : "/default-profile.png" // Fallback if no profileImage
                    }
                    alt="User Profile"
                    className="profile-picture-CP"
                  />
                </div>
                <span className="score-digit">
                  {prediction.homeScore} - {prediction.awayScore}
                </span>
                <div className="outcome-box">
                  {getOutcomeLabel(prediction.outcome)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserPredictions;
