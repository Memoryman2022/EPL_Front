import React, { useState, useEffect } from "react";

//css

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
    <div className="profile-container">
      <div className="main-content-home">
        <div className="user-details">
          <div className="profile-pic-home">
            {userDetails && (
              <img
                src={`${API_URL.replace("/api", "")}${
                  userDetails.profileImage
                }`}
                alt="Profile"
              />
            )}
          </div>
          <div className="user-info">
            <div className="user-info-item">
              <span className="label">Name:</span>
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
      </div>
    </div>
  );
}

export default UserProfile;
