import React, { useState, useContext } from "react";
import { AuthContext } from "../authContext/authContext";
//css
import "../css/Forms.css";

function Register() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { registerUser, authError } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    await registerUser(userName, email, password, profileImage);
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setShowModal(false);
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    document.getElementById("profileImageInput").click();
  };

  return (
    <div className="auth-container">
      <div className="animation-container">
        <img src="/gifs/stadium.gif" alt="Animation" />
      </div>
      <div className="auth-form">
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              value={userName}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              id="profileImageInput"
              onChange={handleImageChange}
              style={{ display: "none" }}
              required
            />
            <button className="auth-btn" onClick={handleImageClick}>
              UPLOAD PROFILE IMAGE
            </button>
          </div>
          {authError && <p className="error">{authError}</p>}
          <button className="auth-btn" type="submit">
            REGISTER
          </button>
        </form>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4 className="typewriter-text">
                Please crop your image to a square for optimal results
              </h4>
              <button className="auth-btn" onClick={handleModalConfirm}>
                CONFIRM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
