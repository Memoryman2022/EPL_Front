
import { Link } from "react-router-dom";
import "../css/About.css"; // Make sure you have a CSS file for styling

const About = () => {
  return (
    <div className="about-page">
     
      <div className="about-content">
        <div className="about-container">
          <h3>THE PREMIER LEAGUE PREDICTOR MODULE</h3>
          

          <h5>FEATURES</h5>
          <ul>
            <li>Predict match outcomes and scores with ease.</li>
            <li>
              Track your performance and see how you stack up against others on
              the leaderboard.
            </li>
            <li>Responsive design that looks great on any device.</li>
            <li>Intuitive user interface designed for a smooth experience.</li>
          </ul>

          <h5>USERS</h5>
          <p>
            <strong >
              <Link to="/base" className="about-link">
                THE PREMIER LEAGUE PREDICTOR MODULE
              </Link>
            </strong>{" "}
            is perfect for casual football fans and social groups looking to add
            a competitive edge to their Premier League experience. Challenge
            your friends and see who has the sharpest football mind!
          </p>

         
        </div>
      </div>
    </div>
  );
};

export default About;
