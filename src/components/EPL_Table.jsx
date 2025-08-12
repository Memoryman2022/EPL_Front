import { useState, useEffect } from "react";
import axios from "axios";
import ResponsiveTeamName from "../components/ResponsiveTeamName";
const API_URL = import.meta.env.VITE_API_URL;

//css
import "../css/EPL_Table.css";

// Mapping function here //
const teamNameToImageMap = {
  "Arsenal FC": "Arsenal.png",
  "Aston Villa FC": "Aston Villa.png",
  "AFC Bournemouth": "Bournemouth.png",
  "Brentford FC": "Brentford.png",
  "Brighton & Hove Albion FC": "Brighton.png",
  "Chelsea FC": "Chelsea.png",
  "Crystal Palace FC": "Crystal Palace.png",
  "Everton FC": "Everton.png",
  "Fulham FC": "Fulham.png",
  "Burnley FC": "Burnley.png",
  "Leeds United FC": "Leeds.png",
  "Liverpool FC": "Liverpool.png",
  "Manchester City FC": "Manchester City.png",
  "Manchester United FC": "Manchester United.png",
  "Newcastle United FC": "Newcastle United.png",
  "Nottingham Forest FC": "Nottm Forest.png",
  "Sunderland AFC": "Sunderland.png",
  "Tottenham Hotspur FC": "Tottenham Hotspur.png",
  "West Ham United FC": "West Ham United.png",
  "Wolverhampton Wanderers FC": "Wolves.png",
};

const getTeamImage = (teamName) => {
  return `teams/${teamNameToImageMap[teamName] || "default.png"}`;
};

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
      const endpoint = `${API_URL}/competitions/2021/standings`; // Backend URL
      console.log(endpoint);
      try {
        const response = await axios.get(endpoint);
        if (response.data && response.data.standings) {
          const standingsData = response.data.standings[0]?.table || [];
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
            <th className="col-team">TEAM</th>
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
                  <img
                    src={`/${getTeamImage(team.team?.name)}`}
                    className="team-logo"
                    alt={`${team.team?.name} logo`}
                  />
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
