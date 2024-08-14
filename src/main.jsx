import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";
import { AuthProviderWrapper } from "./authContext/authContext.jsx";
import { MatchDaysProvider } from "./context/MatchDayContext.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProviderWrapper>
        <MatchDaysProvider>
          <App />
        </MatchDaysProvider>
      </AuthProviderWrapper>
    </Router>
  </React.StrictMode>
);
