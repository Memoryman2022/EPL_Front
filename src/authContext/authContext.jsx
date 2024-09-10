import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { API_URL } from "../config/index";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Utility functions to handle tokens and user data in localStorage
  const storeToken = (token) => localStorage.setItem("jwtToken", token);
  const storeUserId = (userId) => localStorage.setItem("userId", userId);
  const removeToken = () => localStorage.removeItem("jwtToken");
  const removeUserId = () => localStorage.removeItem("userId");

  // Function to refresh the token if it's expired
  const refreshToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/refresh`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      });
      const { token } = response.data;
      storeToken(token);
      await authenticateUser(); // Re-authenticate after refreshing token
    } catch (error) {
      console.error("Error refreshing token:", error);
      logOutUser();
    }
  };

  // Function to authenticate the user based on the JWT token
  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("jwtToken");
    if (!storedToken) {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setIsLoggedIn(true);
      setUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        await refreshToken(); // Refresh token if unauthorized
      } else {
        setAuthError(error.response?.data.message || "Failed to authenticate");
        setIsLoggedIn(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log in the user
  const loginUser = async (email, password) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, userId, user } = response.data;

      if (token && userId && user) {
        storeToken(token);
        storeUserId(userId);
        setUser(user);
        setIsLoggedIn(true);
        navigate(`/base`);
      } else {
        setAuthError("No token or userId received");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAuthError(error.response?.data.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to register a new user
  const registerUser = async (userName, email, password, profileImage) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) formData.append("profileImage", profileImage);

      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { token, userId, user } = response.data;

      if (token && userId && user) {
        storeToken(token);
        storeUserId(userId);
        setUser(user);
        setIsLoggedIn(true);
        navigate(`/base`);
      } else {
        setAuthError("No token or userId received");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setAuthError(error.response?.data.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Log in as guest
  const logInGuest = () => {
    setUser({ role: "guest" });
    setIsLoggedIn(true);
  };

  // Function to log out the user
  const logOutUser = () => {
    removeToken();
    removeUserId();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  // Authenticate the user on component mount
  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        userId: user?._id, // Provide userId as _id
        storeToken,
        storeUserId,
        authenticateUser,
        logInGuest,
        logOutUser,
        loginUser,
        registerUser,
        authError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
