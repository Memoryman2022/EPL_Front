
import { Link } from "react-router-dom";
import "../css/Rules.css"; 

const Rules = () => {
  return (
    <div className="rules-page">
    
      <div className="rules-content">
        <div className="Rules-container">
          <h3>MODULE UTILISATION, RULES AND PRIZES</h3>

          <h5>PREDICTING</h5>
          <p>
            Users can access the prediction field by clicking the desired
            fixture accessible through the calendar. <br />
            Each Match Day will be highlighted for User optimisation.
            <br />
            <br />
            Users should input their score in the field provided. When the
            Predictor Icon is activated, that prediction will then be locked in
            and the collective user predictions for that fixture will be
            displayed.
          </p>

          <h5>POINTS</h5>
          <ul>
            <li>
              Each fixture carries the potential for users to score 7 points.{" "}
            </li>
            <li>3 points are awarded for a correct OUTCOME prediction.</li>
            <li>4 points are awarded for a correct SCORE prediction.</li>
            <li>
              Points will be allocated periodically after each Match Days
              fixtures.
            </li>
          </ul>

          <h5>PRIZE</h5>
          <ul>
            <li>Cost of enrty is £20 (€23.40).</li>
            <li>Winner will recieve the collective pot.</li>
            <li>
              In the event that total users is greater than 10 the league will
              split after Match Day 19.
            </li>
            <li>CHAMPIONSHIP GROUP winner will recieve 75% of the pot.</li>
            <li>RELGATION GROUP winner will recieve the remaining 25%.</li>
            <li>
              If you would like to donate, feel free to add a contribution when
              submitting your entry fee.
            </li>
          </ul>

          <p>
            <strong>
              <Link to="/base">BACK TO BASE</Link>
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rules;
