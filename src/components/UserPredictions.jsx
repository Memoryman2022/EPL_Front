import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../authContext/authContext";
import { API_URL } from "../config/index";
import "../css/UserPredictions.css";

// Helper function to map outcome to "H", "D", or "A"
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
  const [predictions, setPredictions] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchPredictions(fixtureId);
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [isLoggedIn, user, fixtureId]);

  const fetchPredictions = async (fixtureId) => {
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
      const predictions = response.data;
      setPredictions(predictions);
      fetchUserProfiles(predictions.map((p) => p.userId));
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setError("Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfiles = async (userIds) => {
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
            profiles[userId] = response.data;
          } catch (error) {
            console.error(
              `Error fetching profile for userId ${userId}:`,
              error
            );
          }
        })
      );

      setUserProfiles(profiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setError("Failed to fetch user profiles");
    }
  };

  // Sort predictions to show the current user's prediction first
  const sortedPredictions = predictions.sort((a, b) =>
    a.userId === user.userId ? -1 : 1
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-predictions-container">
      <h4 className="pred-H4">CONFIRMED PREDICTIONS</h4>
      {sortedPredictions.length === 0 ? (
        <p>No predictions found for this fixture.</p>
      ) : (
        <ul>
          {sortedPredictions.map((prediction) => (
            <li key={prediction._id} className="user-prediction-item">
              <div className="prediction-details">
                <div className="user-profile-CP">
                  <img
                    src={
                      userProfiles[prediction.userId]?.profileImage
                        ? `${API_URL.replace("/api", "")}${
                            userProfiles[prediction.userId].profileImage
                          }`
                        : "/default-profile.png"
                    }
                    alt="User Profile"
                    className="profile-picture-CP"
                  />
                </div>

                <div className="score-digit"> {prediction.homeScore}</div>
                <div>-</div>
                <div className="score-digit"> {prediction.awayScore}</div>

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