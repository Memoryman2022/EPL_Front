import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/index"; // Ensure this path is correct
//css
import "../css/MatchResult.css"; // Create this CSS file for styling

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to indicate if component is mounted

    const fetchResult = async () => {
      setLoading(true);
      try {
        // Get token from local storage
        const token = localStorage.getItem("jwtToken");

        // Fetch match result with token in the header
        const response = await axios.get(`${API_URL}/results/${fixtureId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the header
          },
        });

        if (isMounted) {
          setResult(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching match result:", error);
          setError("Failed to fetch match result");
          setLoading(false);
        }
      }
    };

    fetchResult();

    // Cleanup function to set isMounted to false
    return () => {
      isMounted = false;
    };
  }, [fixtureId]);

  if (loading) return <div>Loading result...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div class="confirmed-results-container">
      <h4 class="result-header">CONFIRMED RESULT</h4>
      <div class="match-result">
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
