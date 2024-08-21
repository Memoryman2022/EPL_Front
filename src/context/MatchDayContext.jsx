import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";

const API_URL = import.meta.env.VITE_API_URL;

export const MatchDaysContext = createContext();

export const MatchDaysProvider = ({ children }) => {
  const [matchDays, setMatchDays] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/competitions/2021/matches`
        );
        const matches = response.data.matches;

        // Organize fixtures by date and include kickoff time
        const fixturesMap = matches.reduce((acc, fixture) => {
          const date = moment(fixture.utcDate).format("YYYY-MM-DD");
          if (!acc[date]) acc[date] = [];
          acc[date].push(fixture);
          return acc;
        }, {});

        setMatchDays(fixturesMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
        setError("Failed to fetch fixtures");
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <MatchDaysContext.Provider value={{ matchDays, loading, error }}>
      {children}
    </MatchDaysContext.Provider>
  );
};

// Custom hook to use MatchDaysContext
export const useMatchDays = () => {
  const context = useContext(MatchDaysContext);
  if (!context) {
    throw new Error("useMatchDays must be used within a MatchDaysProvider");
  }
  return context;
};
