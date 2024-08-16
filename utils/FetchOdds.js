import React, { useState, useEffect } from "react";
import axios from "axios";

const FetchOdds = ({ fixtureId }) => {
  const [odds, setOdds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch odds data from football-data.org
    const fetchOdds = async () => {
      try {
        // Replace 'YOUR_API_KEY' with your actual API key from football-data.org
        const apiKey = "YOUR_API_KEY";

        const response = await axios.get(
          `https://api.football-data.org/v4/fixtures/${fixtureId}/odds`,
          {
            headers: { "X-Auth-Token": apiKey },
          }
        );

        const data = response.data;

        // Extract the relevant odds data
        if (data.odds && data.odds.length > 0) {
          const matchOdds = data.odds[0];
          setOdds({
            homeWin: matchOdds.homeWin,
            draw: matchOdds.draw,
            awayWin: matchOdds.awayWin,
          });
        } else {
          setError("No odds data available for this fixture.");
        }
      } catch (err) {
        setError("Error fetching odds data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [fixtureId]);

  if (loading) return <p>Loading odds...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Match Odds</h3>
      {odds ? (
        <ul>
          <li>Home Win: {odds.homeWin}</li>
          <li>Draw: {odds.draw}</li>
          <li>Away Win: {odds.awayWin}</li>
        </ul>
      ) : (
        <p>No odds available.</p>
      )}
    </div>
  );
};

export default FetchOdds;
