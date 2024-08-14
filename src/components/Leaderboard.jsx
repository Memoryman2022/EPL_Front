import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/index";
import "../css/Leaderboard.css";

function Leaderboard({ onUserUpdate }) {
  const [users, setUsers] = useState([]);
  const [previousUsers, setPreviousUsers] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 680);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 680);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchedUsers = await axios.get(`${API_URL}/users`);
        const sortedUsers = fetchedUsers.data.sort((a, b) => b.score - a.score);

        // Initialize previousUsers with current positions
        const usersWithPositions = sortedUsers.map((user, index) => ({
          ...user,
          position: index + 1,
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
      // Fetch updated user list
      const fetchedUsers = await axios.get(`${API_URL}/users`);
      const sortedUsers = fetchedUsers.data.sort((a, b) => b.score - a.score);

      const usersWithMovement = sortedUsers.map((user, index) => {
        const prevUser = previousUsers.find((prev) => prev._id === user._id);
        let movement = "";

        if (prevUser) {
          const newPosition = index + 1;
          const previousPosition = prevUser.position;

          if (newPosition < previousPosition) {
            movement = "up";
          } else if (newPosition > previousPosition) {
            movement = "down";
          }

          return {
            ...user,
            position: newPosition,
            previousPosition: previousPosition,
            movement, // Set movement dynamically
          };
        }

        // Initialize movement for new users
        return {
          ...user,
          position: index + 1,
          previousPosition: index + 1,
          movement: "",
        };
      });

      // Update local state with the latest data
      setPreviousUsers(usersWithMovement);
      setUsers(usersWithMovement);

      // Optionally update the backend if needed
      // await axios.put(`${API_URL}/users/update-movements`, {
      //   users: usersWithMovement,
      // });

      // Update the current user in the parent component
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
              <th className="position"></th>
              <th className="name">User</th>
              <th className="correct-outcomes">Outcomes</th>
              <th className="correct-scores">Scores</th>
              <th className="user-score">{isSmallScreen ? "P" : "Points"}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="position">{user.position}</td>
                <td className="name">
                  <img
                    src={
                      user.profileImage
                        ? `${API_URL.replace("/api", "")}${user.profileImage}`
                        : "/default-profile.png" // Use default profile image
                    }
                    alt="Profile"
                    className="profile-pic"
                  />
                  {user.userName}
                  {user.position < user.previousPosition && (
                    <img
                      src={`/gifs/up.gif`}
                      alt="up"
                      className="movement-icon"
                    />
                  )}
                  {user.position > user.previousPosition && (
                    <img
                      src={`/gifs/down.gif`}
                      alt="down"
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
