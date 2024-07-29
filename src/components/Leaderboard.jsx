import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/index";
import "../css/Leaderboard.css";

function Leaderboard({ onUserUpdate }) {
  const [users, setUsers] = useState([]);
  const [previousUsers, setPreviousUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchedUsers = await axios.get(`${API_URL}/users`);
        const sortedUsers = fetchedUsers.data.sort((a, b) => b.score - a.score);

        const usersWithPositions = sortedUsers.map((user, index) => ({
          ...user,
          position: index + 1,
          movement: user.movement || "",
          previousPosition: user.previousPosition || index + 1,
        }));

        setPreviousUsers(usersWithPositions);
        setUsers(usersWithPositions);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  const updateUserMovements = async () => {
    try {
      const fetchedUsers = await axios.get(`${API_URL}/users`);
      const sortedUsers = fetchedUsers.data.sort((a, b) => b.score - a.score);

      const usersWithMovement = sortedUsers.map((user, index) => {
        const prevUser = previousUsers.find((prev) => prev._id === user._id);
        let movement = "";
        if (prevUser) {
          if (index + 1 < prevUser.position) {
            movement = "up";
          } else if (index + 1 > prevUser.position) {
            movement = "down";
          }
        }
        return {
          ...user,
          position: index + 1,
          movement,
          previousPosition: prevUser ? prevUser.position : index + 1,
        };
      });

      setPreviousUsers(usersWithMovement);
      setUsers(usersWithMovement);

      await axios.put(`${API_URL}/users/update-movements`, {
        users: usersWithMovement,
      });

      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("userId");
      const currentUser = sortedUsers.find((user) => user._id === userId);
      if (currentUser && onUserUpdate) {
        onUserUpdate(currentUser);
      }
    } catch (error) {
      console.error("Error updating movements:", error);
    }
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="position">Position</th>
              <th className="name">User</th>
              <th className="correct-outcomes">Outcomes</th>
              <th className="correct-scores">Scores</th>
              <th className="user-score">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="position">{user.position}</td>
                <td className="name">
                  <img
                    src={`${API_URL.replace("/api", "")}${user.profileImage}`}
                    alt="Profile"
                    className="profile-pic"
                  />
                  {user.userName}
                  {user.movement === "up" && (
                    <img src="/up.svg.png" alt="Up" className="movement-icon" />
                  )}
                  {user.movement === "down" && (
                    <img
                      src="/down.svg.png"
                      alt="Down"
                      className="movement-icon"
                    />
                  )}
                </td>
                <td className="correct-scores">{user.correctScores}</td>
                <td className="correct-outcomes">{user.correctOutcomes}</td>
                <td className="score">{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
