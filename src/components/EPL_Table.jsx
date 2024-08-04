import React, { useState, useEffect } from "react";
import axios from "axios";
import ResponsiveTeamName from "../components/ResponsiveTeamName";
//css
import "../css/EPL_Table.css";

function EPL_Table() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState({
    position: "Position",
    points: "Points",
  });

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
        // console.log("API Response:", response.data);

        // Inspect the response structure to find the exact path to the standings
        if (response.data && response.data.standings) {
          // Assuming the first standings object contains the table data
          const standingsData = response.data.standings[0]?.table || [];
          // console.log("Standings Data:", standingsData);
          setStandings(standingsData);
        } else {
          console.error("Standings data not found in the response");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching standings:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setHeaders({
          position: "",
          points: "P",
        });
      } else {
        setHeaders({
          position: "Position",
          points: "Points",
        });
      }
    };

    // Set initial header text based on the current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th className="col-position">{headers.position}</th>
            <th className="col-team">Team</th>
            <th className="col-gp">GP</th>
            <th className="col-w">W</th>
            <th className="col-d">D</th>
            <th className="col-l">L</th>
            <th className="col-gd">+/-</th>
            <th className="col-points">{headers.points}</th>
          </tr>
        </thead>
        <tbody>
          {standings.length > 0 ? (
            standings.map((team, index) => (
              <tr key={index}>
                <td className="col-position">{team.position ?? "N/A"}</td>
                <td className="col-team">
                  <ResponsiveTeamName name={team.team?.name ?? "N/A"} />
                </td>
                <td className="col-gp">{team.playedGames ?? "N/A"}</td>
                <td className="col-w">{team.won ?? "N/A"}</td>
                <td className="col-d">{team.draw ?? "N/A"}</td>
                <td className="col-l">{team.lost ?? "N/A"}</td>
                <td className="col-gd">{team.goalDifference ?? "N/A"}</td>
                <td className="col-points">{team.points ?? "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EPL_Table;
