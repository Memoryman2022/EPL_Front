import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//PAGES
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
//COMPONENTS
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/Profile";
import Leaderboard from "./components/Leaderboard";
//CSS
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route element={<ProtectedRoute />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
