import axios from "axios";

// Function to update user scores
export const updateScores = async (token, isLoggedIn, logOutUser) => {
  try {
    if (!token || !isLoggedIn) {
      throw new Error("No authentication token found. Please log in.");
    }

    // Fetch predictions, results, and odds
    const [predictionsResponse, resultsResponse, oddsResponse] =
      await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/predictions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/results`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/odds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

    const predictions = predictionsResponse.data;
    const results = resultsResponse.data;
    const odds = oddsResponse.data;

    // Create a map to store scores for each user
    const userScores = {};

    // Process predictions and calculate scores
    await Promise.all(
      predictions.map(async (prediction) => {
        const result = results.find(
          (r) => r.fixtureId === prediction.fixtureId
        );
        const matchOdds = odds.find(
          (o) => o.fixtureId === prediction.fixtureId
        );

        if (result && matchOdds) {
          let score = 0;

          const actualOutcome = determineOutcome(
            result.homeScore,
            result.awayScore
          );
          const predictedOutcome = determineOutcome(
            prediction.homeScore,
            prediction.awayScore
          );

          // Calculate the odds multiplier
          const oddsMultiplier = calculateOddsMultiplier(
            matchOdds,
            predictedOutcome
          );

          if (
            prediction.homeScore === result.homeScore &&
            prediction.awayScore === result.awayScore
          ) {
            // Correct Score
            score += 7;
          } else if (predictedOutcome === actualOutcome) {
            // Correct Outcome
            score += 3 * oddsMultiplier;
          }

          // Initialize userScores entry if not present
          if (!userScores[prediction.userId]) {
            userScores[prediction.userId] = {
              score: 0,
            };
          }

          // Accumulate scores
          userScores[prediction.userId].score += Math.round(score);
        }
      })
    );

    // Send the updated scores to the backend
    await Promise.all(
      Object.keys(userScores).map(async (userId) => {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/users/updateScore`,
          {
            userId: userId,
            score: userScores[userId].score,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      })
    );

    alert("Scores updated successfully!");
  } catch (error) {
    console.error("Error updating scores:", error);
    if (error.response?.status === 401) {
      logOutUser(); // Log out the user if the session has expired
      alert("Session expired, please log in again.");
    } else {
      alert("Failed to update scores");
    }
  }
};

// Function to determine match outcome based on scores
const determineOutcome = (homeScore, awayScore) => {
  if (homeScore > awayScore) return "homeWin";
  if (homeScore < awayScore) return "awayWin";
  return "draw";
};

// Function to calculate the odds multiplier based on predicted outcome
const calculateOddsMultiplier = (odds, predictedOutcome) => {
  const sumOfOdds = odds.homeWin + odds.draw + odds.awayWin;
  switch (predictedOutcome) {
    case "homeWin":
      return odds.homeWin / sumOfOdds;
    case "draw":
      return odds.draw / sumOfOdds;
    case "awayWin":
      return odds.awayWin / sumOfOdds;
    default:
      return 0;
  }
};
