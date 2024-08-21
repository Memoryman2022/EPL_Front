import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/index";
import ResponsiveTeamName from "../components/ResponsiveTeamName";

// css
import "../css/UserPoint.css";

const UserPoints = () => {
  const [matchesByDay, setMatchesByDay] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedMatchDay, setExpandedMatchDay] = useState(null);
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  useEffect(() => {
    // Function to fetch completed matches and user predictions
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const [matchesResponse, predictionsResponse] = await Promise.all([
          axios.get(`${API_URL}/results`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_URL}/predictions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const matches = matchesResponse.data;

        // Group matches by matchday
        const groupedByDay = matches.reduce((acc, match) => {
          const matchDay = match.matchday;
          if (!acc[matchDay]) acc[matchDay] = [];
          acc[matchDay].push(match);
          return acc;
        }, {});

        setMatchesByDay(groupedByDay);
        setPredictions(predictionsResponse.data);

        // Fetch user profiles
        const userIds = predictionsResponse.data.map((pred) => pred.userId);
        fetchUserProfiles(userIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch user profiles
    const fetchUserProfiles = async (userIds) => {
      try {
        const token = localStorage.getItem("jwtToken");
        const profiles = {};

        await Promise.all(
          userIds.map(async (userId) => {
            if (!profiles[userId]) {
              const response = await axios.get(
                `${API_URL}/users/protected/user/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              profiles[userId] = response.data;
            }
          })
        );

        setUserProfiles(profiles);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchData();
  }, []);

  // Map outcomes to display values
  const mapOutcome = (outcome) => {
    switch (outcome) {
      case "homeWin":
        return "HOME WIN";
      case "awayWin":
        return "AWAY WIN";
      case "draw":
        return "DRAW";
      default:
        return outcome;
    }
  };

  // Calculate the score based on predictions
  const calculatePoints = (matchId) => {
    const userPrediction = predictions.find(
      (pred) => pred.fixtureId === matchId
    );
    if (!userPrediction) return 0;

    const match = Object.values(matchesByDay)
      .flat()
      .find((m) => m.fixtureId === matchId);
    if (!match) return 0;

    let score = 0;
    if (
      userPrediction.homeScore === match.homeScore &&
      userPrediction.awayScore === match.awayScore
    ) {
      score = 7;
    } else if (userPrediction.outcome === match.outcome) {
      score = 3;
    }

    return score;
  };

  const handleMatchDayClick = (matchDay) => {
    setExpandedMatchDay(expandedMatchDay === matchDay ? null : matchDay);
  };

  const handleTitleClick = (matchId) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-points-container">
      <h4 className="user-points-header">COMPLETED MATCHES AND PREDICTIONS</h4>
      {Object.keys(matchesByDay).length === 0 ? (
        <p className="no-data">No completed matches found.</p>
      ) : (
        <ul className="matchdays-list">
          {Object.entries(matchesByDay).map(([matchDay, matches]) => (
            <li key={matchDay} className="matchday-item">
              <h3
                className="matchday-title"
                onClick={() => handleMatchDayClick(matchDay)}
              >
                MATCHDAY {matchDay}
              </h3>
              {expandedMatchDay === matchDay && (
                <ul className="matches-list">
                  {matches.map((match) => (
                    <li key={match.fixtureId} className="match-item">
                      <h4
                        className="match-title"
                        onClick={() => handleTitleClick(match.fixtureId)}
                      >
                        <ResponsiveTeamName name={match.homeTeam} /> vs{" "}
                        <ResponsiveTeamName name={match.awayTeam} />
                      </h4>
                      {expandedMatchId === match.fixtureId && (
                        <div className="match-details-container">
                          <div className="match-row">
                            <p className="match-details">{`${match.homeScore} - ${match.awayScore}`}</p>
                            <p className="match-details">{`${mapOutcome(
                              match.outcome
                            )}`}</p>
                          </div>

                          {predictions.some(
                            (pred) => pred.fixtureId === match.fixtureId
                          ) ? (
                            <div className="prediction-container">
                              <h5 className="prediction-title">PREDICTION</h5>
                              {predictions
                                .filter(
                                  (pred) => pred.fixtureId === match.fixtureId
                                )
                                .map((prediction) => (
                                  <div
                                    key={prediction._id}
                                    className="prediction-item"
                                  >
                                    <div className="user-info-scores">
                                      <img
                                        src={
                                          userProfiles[prediction.userId]
                                            ?.profileImage
                                            ? `${API_URL.replace("/api", "")}${
                                                userProfiles[prediction.userId]
                                                  .profileImage
                                              }`
                                            : "/default-profile.png"
                                        }
                                        alt="User Profile"
                                        className="profile-picture-scores"
                                      />
                                      <div className="user-column">
                                        <span className="user-name-scores">
                                          {userProfiles[prediction.userId]
                                            ?.userName || "Unknown User"}
                                        </span>
                                        <p>{`SCORE: ${prediction.homeScore} - ${prediction.awayScore}`}</p>
                                        <p>{`OUTCOME: ${mapOutcome(
                                          prediction.outcome
                                        )}`}</p>
                                        <p>{`POINTS: ${calculatePoints(
                                          match.fixtureId
                                        )}`}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="SHIT">PREDICTION MISSING</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPoints;
