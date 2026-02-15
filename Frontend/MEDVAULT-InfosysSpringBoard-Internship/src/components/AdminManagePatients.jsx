import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminManagePatients.css';

const PATIENTS_KEY = 'adminPatients';
const APPOINTMENTS_KEY = 'patientAppointments';

const seedPatients = [
  {
    id: 1,
    name: 'Rahul Agrawal',
    email: 'rahul.agrawal@email.com',
    phone: '+91 98450 11223',
    hospital: 'CityCare Hospital'
  },
  {
    id: 2,
    name: 'Meera Patel',
    email: 'meera.patel@email.com',
    phone: '+91 99210 55443',
    hospital: 'Green Valley Clinic'
  },
  {
    id: 3,
    name: 'Kabir Das',
    email: 'kabir.das@email.com',
    phone: '+91 98100 77888',
    hospital: 'CityCare Hospital'
  }
];

const AdminManagePatients = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hospital: ''
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
    if (stored.length === 0) {
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(seedPatients));
      setPatients(seedPatients);
      return;
    }
    setPatients(stored);
  }, []);

  const appointments = useMemo(() => {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
  }, []);

  const patientAppointments = useMemo(() => {
    return patients.map((patient) => {
      const assigned = appointments.filter((item) => item.patientName === patient.name);
      return {
        ...patient,
        assigned
      };
    });
  }, [patients, appointments]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleAddPatient = () => {
    if (!formData.name || !formData.email || !formData.hospital) {
      return;
    }
    const updated = [
      {
        id: Date.now(),
        ...formData
      },
      ...patients
    ];
    setPatients(updated);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
    setFormData({ name: '', email: '', phone: '', hospital: '' });
  };

  const handleDeletePatient = (id) => {
    const updated = patients.filter((patient) => patient.id !== id);
    setPatients(updated);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="admin-manage-page">
      <header className="manage-header">
        <div>
          <h1>Manage Patients</h1>
          <p>Maintain patient records and assigned appointments.</p>
        </div>
        <button className="ghost-btn" onClick={() => navigate('/admin-dashboard')}>
          Back to Dashboard
        </button>
      </header>

      <div className="manage-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          Patients
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Assigned Appointments
        </button>
      </div>

      {activeTab === 'patients' && (
        <section className="manage-section">
          <div className="manage-grid">
            <div className="manage-card">
              <h2>Add Patient</h2>
              <label htmlFor="name">Patient Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Patient name"
              />
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@email.com"
              />
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
              <label htmlFor="hospital">Hospital</label>
              <input
                id="hospital"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                placeholder="CityCare Hospital"
              />
              <button className="primary-btn" onClick={handleAddPatient}>
                Add Patient
              </button>
            </div>

            <div className="manage-card">
              <h2>All Patients</h2>
              <div className="manage-list">
                {patients.map((patient) => (
                  <div key={patient.id} className="manage-row">
                    <div>
                      <h3>{patient.name}</h3>
                      <p>{patient.hospital}</p>
                      <span>{patient.email} • {patient.phone}</span>
                    </div>
                    <button className="danger-btn" onClick={() => handleDeletePatient(patient.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'appointments' && (
        <section className="manage-section">
          <h2>Assigned appointments</h2>
          <div className="appointments-grid">
            {patientAppointments.map((patient) => (
              <div key={patient.id} className="manage-card">
                <h3>{patient.name}</h3>
                <p>{patient.hospital}</p>
                {patient.assigned.length === 0 ? (
                  <p className="muted">No assigned appointments.</p>
                ) : (
                  <ul className="appointment-list">
                    {patient.assigned.map((item) => (
                      <li key={item.id}>
                        {item.doctor} • {item.date} • {item.time} ({item.status})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminManagePatients;
