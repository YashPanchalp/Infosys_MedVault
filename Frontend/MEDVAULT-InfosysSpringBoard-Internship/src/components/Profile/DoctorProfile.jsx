import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    specialization: '',
    experienceYears: '',
    qualification: '',
    licenseNumber: '',
    hospitalName: '',
    hospitalAddress: '',
    consultationMode: ''
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
            <h1 className="profile-title">Doctor Profile</h1>
            <p className="profile-subtitle">Manage your professional details</p>
          </div>
          <div className="profile-actions">
            <button type="button" className="secondary-btn" onClick={() => navigate('/doctor-dashboard')}>
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
            <h2 className="section-title">Professional Details</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <span className="profile-label">Specialization</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleChange}
                    placeholder="Cardiologist, Dentist"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.specialization)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Experience (Years)</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="number"
                    name="experienceYears"
                    value={profile.experienceYears}
                    onChange={handleChange}
                    min="0"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.experienceYears)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Qualification</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="qualification"
                    value={profile.qualification}
                    onChange={handleChange}
                    placeholder="MBBS, MD"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.qualification)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">License Number</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="licenseNumber"
                    value={profile.licenseNumber}
                    onChange={handleChange}
                    placeholder="Registration number"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.licenseNumber)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Hospital Name</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="hospitalName"
                    value={profile.hospitalName}
                    onChange={handleChange}
                    placeholder="Hospital or clinic"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.hospitalName)}</span>
                )}
              </div>
              <div className="profile-field">
                <span className="profile-label">Consultation Mode</span>
                {isEditing ? (
                  <select
                    className="profile-input"
                    name="consultationMode"
                    value={profile.consultationMode}
                    onChange={handleChange}
                  >
                    <option value="">Select mode</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="both">Both</option>
                  </select>
                ) : (
                  <span className="profile-value">{displayValue(profile.consultationMode)}</span>
                )}
              </div>
              <div className="profile-field full-width">
                <span className="profile-label">Hospital Address</span>
                {isEditing ? (
                  <input
                    className="profile-input"
                    type="text"
                    name="hospitalAddress"
                    value={profile.hospitalAddress}
                    onChange={handleChange}
                    placeholder="Street, City, State"
                  />
                ) : (
                  <span className="profile-value">{displayValue(profile.hospitalAddress)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
