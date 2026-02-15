import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgetPass.css';
import axios from "axios";

const ForgetPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/forgot-password/request-otp", { email });
      localStorage.setItem("resetEmail", email);
      navigate('/otp-verify', {
        state: {
          type: "reset",
          userData: { email }
        }
      });
    } catch (error) {
      const message = error.response?.data || "Failed to request OTP";
      console.error("Forgot password request failed:", error);
      alert(message);
    }
  };

  return (
    <div className="forget-container">
      <div className="medical-bg">
        <div className="pulse-circle"></div>
        <div className="pulse-circle"></div>
        <div className="pulse-circle"></div>
      </div>

      <div className="forget-card">
        <div className="forget-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="logo-text">MedVault</h1>
          </div>
          <p className="forget-subtitle">Reset your password securely</p>
        </div>

        <form onSubmit={handleSubmit} className="forget-form">
          <div className="form-group">
            <label htmlFor="email">Registered Email</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button type="submit" className="forget-btn">
            <span>Send OTP</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        <div className="forget-footer">
          <p>Remembered your password?
            <button onClick={() => navigate('/login')} className="link-btn">
              Back to Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
