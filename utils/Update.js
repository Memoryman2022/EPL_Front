import axios from "axios";

// Function to update user scores
export const updateScores = async (token, isLoggedIn, logOutUser) => {
  try {
    // Check if token exists and the user is logged in
    if (!token || !isLoggedIn) {
      throw new Error("No authentication token found. Please log in.");
    }

    // Fetch predictions and results from the API
    const predictionsResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/predictions`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const resultsResponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/results`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const predictions = predictionsResponse.data;
    const results = resultsResponse.data;

    // Create a map to store scores for each user
    const userScores = {};

    // Process predictions and calculate scores
    await Promise.all(
      predictions.map(async (prediction) => {
        const result = results.find(
          (r) => r.fixtureId === prediction.fixtureId
        );
        if (result) {
          let score = 0;
          let correctScores = 0;
          let correctOutcomes = 0;

          if (
            prediction.homeScore === result.homeScore &&
            prediction.awayScore === result.awayScore &&
            prediction.outcome === result.outcome
          ) {
            score = 7;
            correctScores = 1;
          } else if (prediction.outcome === result.outcome) {
            score = 3;
            correctOutcomes = 1;
          }

          // Update the userScores map
          if (!userScores[prediction.userId]) {
            userScores[prediction.userId] = {
              score: 0,
              correctScores: 0,
              correctOutcomes: 0,
            };
          }

          userScores[prediction.userId].score += score;
          userScores[prediction.userId].correctScores += correctScores;
          userScores[prediction.userId].correctOutcomes += correctOutcomes;
        }
      })
    );

    // Send the updated scores to the backend
    await Promise.all(
      Object.keys(userScores).map(async (userId) => {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/users/updateScore`,
          {
            userId: userId,
            ...userScores[userId],
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      })
    );

    // Alert the user that scores have been updated
    alert("Scores updated successfully!");
  } catch (error) {
    // Log and handle errors
    console.error("Error updating scores:", error);
    if (error.response?.status === 401) {
      logOutUser(); // Log out the user if the session has expired
      alert("Session expired, please log in again.");
    } else {
      alert("Failed to update scores");
    }
  }
};
