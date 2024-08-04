import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/index";
import axios from "axios";
import moment from "moment";
import ResponsiveTeamName from "../components/ResponsiveTeamName";
import DropdownMenu from "../components/DDP";
import { AuthContext } from "../authContext/authContext";
//css
import "../css/Fixtures.css";

function FixtureDetails() {
  const { date } = useParams();
  const { user } = useContext(AuthContext);
  const [fixtures, setFixtures] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetchFixtures();
    fetchPredictions();
  }, [date, user]);

  const fetchFixtures = async () => {
    try {
      const response = await axios.get(`/api/v4/competitions/2021/matches`, {
        headers: {
          "X-Auth-Token": "ab607df2daca41f9963fc2acce71bd52",
        },
      });

      const matches = response.data.matches.filter(
        (fixture) => moment(fixture.utcDate).format("YYYY-MM-DD") === date
      );

      setFixtures(matches);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      setError(error);
      setLoading(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No JWT token found");
        return;
      }
      const response = await axios.get(
        `${API_URL}/predictions/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userPredictions = response.data.reduce((acc, prediction) => {
        acc[prediction.fixtureId] = prediction;
        return acc;
      }, {});

      setPredictions(userPredictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const handlePredictionClick = (fixtureId) => {
    if (!predictions[fixtureId]) {
      setOpenDropdown(openDropdown === fixtureId ? null : fixtureId);
    }
  };

  const calculateOutcome = (homeScore, awayScore) => {
    if (homeScore > awayScore) return "homeWin";
    if (homeScore < awayScore) return "awayWin";
    return "draw";
  };

  const handleConfirm = async (fixtureId, homeScore, awayScore) => {
    if (homeScore === "" || awayScore === "") {
      alert("Please enter both home and away scores.");
      return;
    }
    const outcome = calculateOutcome(homeScore, awayScore);
    const userId = user?.userId;

    const payload = {
      fixtureId,
      userId,
      homeScore,
      awayScore,
      outcome,
    };

    console.log("Payload to send:", payload);

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(`${API_URL}/predictions`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPredictions((prev) => ({
        ...prev,
        [fixtureId]: { homeScore, awayScore, outcome },
      }));

      setOpenDropdown(null);
      console.log("Prediction saved:", response.data);
    } catch (error) {
      console.error("Error saving prediction:", error);
      alert("Failed to save prediction. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching fixtures</p>;

  const formattedDate = moment(date).format("DD.MM.YYYY");

  return (
    <div className="fixtures-container">
      <h5>FIXTURES FOR {formattedDate}</h5>
      <ul className="fixtures-list">
        {fixtures.map((fixture) => (
          <React.Fragment key={fixture.id}>
            <li
              className="fixture-item"
              onClick={() => handlePredictionClick(fixture.id)}
            >
              <span className="fixture-time">
                {moment(fixture.utcDate).format("HH:mm")}
              </span>
              <span className="fixture-home">
                <ResponsiveTeamName name={fixture.homeTeam.name} />
              </span>
              <span className="fixture-vs">vs</span>
              <span className="fixture-away">
                <ResponsiveTeamName name={fixture.awayTeam.name} />
              </span>
              <div
                className={`prediction-box ${
                  predictions[fixture.id] ? "confirmed" : ""
                }`}
              >
                <img
                  src={
                    predictions[fixture.id]
                      ? "/icons/lock.png"
                      : "/icons/predict.png"
                  }
                  alt={predictions[fixture.id] ? "Confirmed" : "Predict"}
                />
              </div>
            </li>
            {openDropdown === fixture.id && (
              <li className="dropdown-container">
                <DropdownMenu
                  isOpen={openDropdown === fixture.id}
                  onClose={() => setOpenDropdown(null)}
                  fixture={{ ...fixture, image: "/icons/predict.png" }} // Pass the confirm image URL
                  onConfirm={handleConfirm}
                />
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default FixtureDetails;
