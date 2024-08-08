import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/index";
import "../css/MatchResult.css";

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

const MatchResult = ({ fixtureId }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchResult = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");

        const response = await axios.get(`${API_URL}/results/${fixtureId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setResult(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          if (error.response && error.response.status === 404) {
            // Result not found, show "RESULT PENDING..."
            setError("RESULT PENDING...");
          } else {
            // Handle other types of errors
            console.error("Error fetching match result:", error);
            setError("An error occurred. Please try again later.");
          }
          setLoading(false);
        }
      }
    };

    fetchResult();

    return () => {
      isMounted = false;
    };
  }, [fixtureId]);

  if (loading) return <div>Loading result...</div>;
  if (error) return <div className="error-message" data-text={error}></div>;

  if (!result) return null;

  return (
    <div className="confirmed-results-container">
      <h4 className="result-header">____RESULT</h4>
      <div className="match-result">
        <span className="match-result-score">
          {result.homeScore} - {result.awayScore}
        </span>
        <div className="match-result-outcome">
          {getOutcomeLabel(result.outcome)}
        </div>
      </div>
    </div>
  );
};

export default MatchResult;
