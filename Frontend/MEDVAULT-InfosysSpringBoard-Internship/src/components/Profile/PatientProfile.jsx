import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientProfile.css';

const PatientProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    gender: '',
    bloodGroup: '',
    address: '',
    height: '',
    weight: '',
    sugarLevel: '',
    allergies: '',
    emergencyContact: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = () => {
    const stored = localStorage.getItem('medvaultProfile');
    const parsed = stored ? JSON.parse(stored) : {};
    setProfile((prev) => ({
      ...prev,
      ...parsed
    }));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.dataset.theme = savedTheme;
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('medvaultProfile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleCancel = () => {
    loadProfile();
    setIsEditing(false);
  };

  const displayValue = (value) => (value ? value : 'Not set');

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <div className="profile-topbar">
          <div>
            <h1 className="profile-title">Patient Profile</h1>
            <p className="profile-subtitle">Review your health details</p>
          </div>
          <div className="profile-actions">
            <button type="button" className="secondary-btn" onClick={() => navigate('/patient-dashboard')}>
              Back to Dashboard
            </button>
            {isEditing ? (
              <>
                <button type="button" className="secondary-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" className="primary-btn" onClick={handleSave}>
                  Save Profile
                </button>
              </>
            ) : (
              <button type="button" className="primary-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-section">
            <h2 className="section-title">Basic Info</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <span className="profile-label">Full Name</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.username)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Email</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.email)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Phone Number</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="tel"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.phoneNumber)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Health Details</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <span className="profile-label">Gender</span>
                {isEditing ? (
                  <select
                    className="profile-input"
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                ) : (
                  <span className="profile-value">{displayValue(profile.gender)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Blood Group</span>
                {isEditing ? (
                  <select
                    className="profile-input"
                    name="bloodGroup"
                    value={profile.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                ) : (
                  <span className="profile-value">{displayValue(profile.bloodGroup)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Height (cm)</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="number"
                    name="height"
                    value={profile.height}
                    onChange={handleChange}
                    min="0"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.height)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Weight (kg)</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="number"
                    name="weight"
                    value={profile.weight}
                    onChange={handleChange}
                    min="0"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.weight)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Sugar Level (mg/dL)</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="number"
                    name="sugarLevel"
                    value={profile.sugarLevel}
                    onChange={handleChange}
                    min="0"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.sugarLevel)}</span>
                )}
              </div>
              <div className="profile-field full-width">
                <span className="profile-label">Address</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Street, City, State"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.address)}</span>
                )}
              </div>
              <div className="profile-field full-width">
                <span className="profile-label">Allergies</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="allergies"
                    value={profile.allergies}
                    onChange={handleChange}
                    placeholder="List any allergies"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.allergies)}</span>
                )}
              </div>
              <div className="profile-field full-width">
                <span className="profile-label">Emergency Contact</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="emergencyContact"
                    value={profile.emergencyContact}
                    onChange={handleChange}
                    placeholder="Name and phone number"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.emergencyContact)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
