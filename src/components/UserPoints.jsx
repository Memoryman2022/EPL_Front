import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/index";
import ResponsiveTeamName from "../components/ResponsiveTeamName";

// css
import "../css/UserPoint.css";

const UserPoints = () => {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
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

        setMatches(matchesResponse.data);
        setPredictions(predictionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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

    const match = matches.find((m) => m.fixtureId === matchId);
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

  const handleTitleClick = (matchId) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-points-container">
      <h4 className="user-points-header">COMPLETED MATCHES AND PREDICTIONS</h4>
      {matches.length === 0 ? (
        <p className="no-data">No completed matches found.</p>
      ) : (
        <ul className="matches-list">
          {matches.map((match) => (
            <li key={match.fixtureId} className="match-item">
              <h2
                className="match-title"
                onClick={() => handleTitleClick(match.fixtureId)}
              >
                <ResponsiveTeamName name={match.homeTeam} /> vs{" "}
                <ResponsiveTeamName name={match.awayTeam} />
              </h2>
              {expandedMatchId === match.fixtureId && (
                <div className="match-details-container">
                  <p className="match-details">{`${match.homeScore} - ${match.awayScore}`}</p>
                  <p className="match-details">{`${mapOutcome(
                    match.outcome
                  )}`}</p>

                  {predictions.some(
                    (pred) => pred.fixtureId === match.fixtureId
                  ) ? (
                    <div className="prediction-container">
                      <h5 className="prediction-title">PREDICTION</h5>
                      {predictions
                        .filter((pred) => pred.fixtureId === match.fixtureId)
                        .map((prediction) => (
                          <div key={prediction._id} className="prediction-item">
                            <p>{`SCORE: ${prediction.homeScore} - ${prediction.awayScore}`}</p>
                            <p>{`OUTCOME: ${mapOutcome(
                              prediction.outcome
                            )}`}</p>
                            <p>{`POINTS: ${calculatePoints(
                              match.fixtureId
                            )}`}</p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p>No prediction made for this match.</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPoints;
