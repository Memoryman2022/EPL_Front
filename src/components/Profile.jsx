import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
//css
import "../css/Profile.css";
const fetchUserDetails = async (userId, token) => {
  const response = await fetch(`${API_URL}/users/protected/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

function UserProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAndSetUserDetails = async () => {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setLoading(true);
      try {
        const data = await fetchUserDetails(userId, token);
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAndSetUserDetails();
  }, []);

  // Update user details based on leaderboard changes
  const handleLeaderboardUpdate = (updatedUserDetails) => {
    setUserDetails(updatedUserDetails);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-pic-home">
        {userDetails && (
          <img
            src={`${API_URL.replace("/api", "")}${userDetails.profileImage}`}
            alt="Profile"
          />
        )}
      </div>
      <div className="user-info">
        <div className="user-info-item">
          <span className="label">User:</span>
          <span className="value">
            {userDetails ? userDetails.userName : "Loading..."}
          </span>
        </div>
        <div className="user-info-item">
          <span className="label">Score:</span>
          <span className="value">
            {userDetails ? userDetails.score : "Loading..."}
          </span>
        </div>
        <div className="user-info-item">
          <span className="label">Position:</span>
          <span className="value">
            {userDetails ? userDetails.position : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
