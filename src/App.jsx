import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//PAGES
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Base from "./pages/Base";
import About from "./pages/About";
import Rules from "./pages/Rules";
import Logout from "./pages/Logout";
//COMPONENTS
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/Profile";
import Leaderboard from "./components/Leaderboard";
import FixtureCalendar from "./components/Calender";
import FixturesByDate from "./components/Fixtures";
import GuestViewOnly from "./components/GuestViewOnly";
//CSS
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <div className="BIG">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/about" element={<About />} />

          <Route path="/guest-view-only" element={<GuestViewOnly />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/base" element={<Base />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/calendar" element={<FixtureCalendar />} />
            <Route path="/fixtures/:date" element={<FixturesByDate />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
