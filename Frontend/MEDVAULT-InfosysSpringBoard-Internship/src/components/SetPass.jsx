import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SetPass.css';
import axios from "axios";

const SetPass = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 🔥 Resolve email once
  const resolvedEmail =
    location.state?.email || localStorage.getItem("resetEmail");

  useEffect(() => {
    if (!resolvedEmail) {
      navigate('/login');
    }
  }, [resolvedEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("/api/auth/forgot-password/reset", {
        email: resolvedEmail,
        newPassword: password
      });

      localStorage.removeItem("resetEmail");
      alert("Password reset successful!");
      navigate('/login');

    } catch (error) {
      const message =
        error.response?.data || "Failed to reset password";
      console.error("Reset password failed:", error);
      alert(message);
    }
  };

  return (
  <div className="setpass-container">
    <div className="medical-bg">
      <div className="pulse-circle"></div>
      <div className="pulse-circle"></div>
      <div className="pulse-circle"></div>
    </div>

    <div className="setpass-card">
      <div className="setpass-header">
        <h1 className="logo-text">MedVault</h1>
        <p className="setpass-subtitle">Create a new password</p>
      </div>

      <form onSubmit={handleSubmit} className="setpass-form">

        <div className="form-group">
          <label>New Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
        </div>

        <button type="submit" className="setpass-btn">
          <span>Update Password</span>
        </button>
      </form>

      <div className="setpass-footer">
        <p>
          Back to
          <button
            onClick={() => navigate('/login')}
            className="link-btn"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  </div>
);
};

export default SetPass;
