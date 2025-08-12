import { useState, useEffect, useContext } from "react";
import { API_URL } from "../config";
import { AuthContext } from "../authContext/authContext"; // Import your AuthContext for user role
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

function UserProfile({ triggerUpdate }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext); // Get user details from AuthContext
  const isGuest = user?.role === "guest"; // Check if the user is a guest

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
    if (!isGuest) {
      fetchAndSetUserDetails();
    }
  }, [triggerUpdate, isGuest]); // Refetch when `triggerUpdate` changes or user role changes

  return (
    <div className="user-profile">
      <div className="profile-pic-home">
        {userDetails && !isGuest && (
          <img
            src={
              userDetails && userDetails.profileImage
                ? `${API_URL.replace("/api", "")}${userDetails.profileImage}`
                : "/default-profile.png" // Fallback image
            }
            alt="Profile"
          />
        )}
        {isGuest && <img src="/default-profile.png" alt="Guest Profile" />}
      </div>
      <div className="user-info">
        <div className="user-info-item">
          <span className="label">User:</span>
          <span className="value">
            {isGuest
              ? "Guest"
              : userDetails
              ? userDetails.userName
              : "Loading..."}
          </span>
        </div>
        <div className="user-info-item">
          <span className="label">Score:</span>
          <span className="value">
            {isGuest ? "N/A" : userDetails ? userDetails.score : "Loading..."}
          </span>
        </div>
        <div className="user-info-item">
          <span className="label">Position:</span>
          <span className="value">
            {isGuest
              ? "N/A"
              : userDetails
              ? userDetails.position
              : "Loading..."}
          </span>
        </div>
      </div>
      
    </div>
  );
}

export default UserProfile;
