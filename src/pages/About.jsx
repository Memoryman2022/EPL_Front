import React from "react";
import { Link } from "react-router-dom";
import "../css/About.css"; // Make sure you have a CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h3>THE PREMIER LEAGUE PREDICTOR MODULE</h3>
      <p>
        Welcome to{" "}
        <strong className="highlighted-text">
          <Link to="/base" className="about-link">
            THE PREMIER LEAGUE PREDICTOR MODULE
          </Link>
        </strong>
        , your exclusive platform for predicting Premier League matches! Whether
        you're a casual fan or part of a social group, this app provides a fun
        and engaging way to test your football knowledge and compete with
        friends.
      </p>

      <h5>MISSION</h5>
      <p>
        Our mission is to showcase the stylings and functionality of modern web
        development through a polished, user-friendly application. Developed by
        an independent coder, this project serves as a testament to my expanding
        portfolio and dedication to crafting high-quality software.
      </p>

      <h5>FEATURES</h5>
      <ul>
        <li>Predict match outcomes and scores with ease.</li>
        <li>
          Track your performance and see how you stack up against others on the
          leaderboard.
        </li>
        <li>Responsive design that looks great on any device.</li>
        <li>Intuitive user interface designed for a smooth experience.</li>
      </ul>

      <h5>USERS</h5>
      <p>
        <strong className="highlighted-text">
          <Link to="/base" className="about-link">
            THE PREMIER LEAGUE PREDICTOR MODULE
          </Link>
        </strong>{" "}
        is perfect for casual football fans and social groups looking to add a
        competitive edge to their Premier League experience. Challenge your
        friends and see who has the sharpest football mind!
      </p>

      <h5>DEVELOPER</h5>
      <p>
        I'm an independent coder passionate about building engaging and
        functional web applications. This project is a key part of my portfolio
        as I work on expanding my skills and showcasing my abilities. Thank you.
        Now get out there and start{" "}
        <strong className="highlighted-text">
          <Link to="/base"> PREDICTING! </Link>
        </strong>
      </p>
    </div>
  );
};

export default About;
