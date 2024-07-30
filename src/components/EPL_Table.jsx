import React, { useState, useEffect } from "react";
import axios from "axios";

function EPL_Table() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      const options = {
        method: "GET",
        url: "/api/v4/competitions/2021/standings", // Endpoint for Premier League standings
        headers: {
          "X-Auth-Token": "ab607df2daca41f9963fc2acce71bd52", // Your API token
        },
      };

      try {
        const response = await axios.request(options);
        console.log("API Response:", response.data); // Log the API response
        setStandings(response.data.standings[0]?.table || []); // Adjust based on the actual response structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching standings:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div className="table-container">
      <h2>Premier League Standings</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Team</th>
            <th>Played</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.length > 0 ? (
            standings.map((team, index) => (
              <tr key={index}>
                <td>{team.position ?? "N/A"}</td>
                <td>{team.team?.name ?? "N/A"}</td>
                <td>{team.playedGames ?? "N/A"}</td>
                <td>{team.points ?? "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EPL_Table;
