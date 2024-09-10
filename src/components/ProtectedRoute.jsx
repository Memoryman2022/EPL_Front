import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../authContext/authContext";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  // Redirect guests to a read-only view
  if (isLoggedIn && user?.role === "guest") {
    return <Navigate to="/guest-view-only" />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
