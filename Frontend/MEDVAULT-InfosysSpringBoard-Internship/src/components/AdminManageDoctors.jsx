import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminManageDoctors.css';

const DOCTORS_KEY = 'adminDoctors';
const APPOINTMENTS_KEY = 'patientAppointments';

const seedDoctors = [
  {
    id: 1,
    name: 'Dr. Rhea Kapoor',
    department: 'Cardiology',
    hospital: 'CityCare Hospital',
    email: 'rhea.kapoor@citycare.org'
  },
  {
    id: 2,
    name: 'Dr. Imran Ali',
    department: 'Endocrinology',
    hospital: 'Green Valley Clinic',
    email: 'imran.ali@greenvalley.org'
  },
  {
    id: 3,
    name: 'Dr. Kavya Menon',
    department: 'Nutrition',
    hospital: 'CityCare Hospital',
    email: 'kavya.menon@citycare.org'
  }
];

const AdminManageDoctors = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    hospital: '',
    email: ''
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(DOCTORS_KEY) || '[]');
    if (stored.length === 0) {
      localStorage.setItem(DOCTORS_KEY, JSON.stringify(seedDoctors));
      setDoctors(seedDoctors);
      return;
    }
    setDoctors(stored);
  }, []);

  const appointments = useMemo(() => {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
  }, []);

  const doctorAppointments = useMemo(() => {
    return doctors.map((doctor) => {
      const assigned = appointments.filter((item) => item.doctor === doctor.name);
      return {
        ...doctor,
        assigned
      };
    });
  }, [doctors, appointments]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleAddDoctor = () => {
    if (!formData.name || !formData.department || !formData.hospital) {
      return;
    }
    const updated = [
      {
        id: Date.now(),
        ...formData
      },
      ...doctors
    ];
    setDoctors(updated);
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(updated));
    setFormData({ name: '', department: '', hospital: '', email: '' });
  };

  const handleDeleteDoctor = (id) => {
    const updated = doctors.filter((doctor) => doctor.id !== id);
    setDoctors(updated);
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="admin-manage-page">
      <header className="manage-header">
        <div>
          <h1>Manage Doctors</h1>
          <p>Maintain doctor profiles and assigned appointments.</p>
        </div>
        <button className="ghost-btn" onClick={() => navigate('/admin-dashboard')}>
          Back to Dashboard
        </button>
      </header>

      <div className="manage-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          Doctors
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Assigned Appointments
        </button>
      </div>

      {activeTab === 'doctors' && (
        <section className="manage-section">
          <div className="manage-grid">
            <div className="manage-card">
              <h2>Add Doctor</h2>
              <label htmlFor="name">Doctor Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
              />
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Cardiology"
              />
              <label htmlFor="hospital">Hospital</label>
              <input
                id="hospital"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                placeholder="CityCare Hospital"
              />
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@hospital.org"
              />
              <button className="primary-btn" onClick={handleAddDoctor}>
                Add Doctor
              </button>
            </div>

            <div className="manage-card">
              <h2>All Doctors</h2>
              <div className="manage-list">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="manage-row">
                    <div>
                      <h3>{doctor.name}</h3>
                      <p>{doctor.department} • {doctor.hospital}</p>
                      <span>{doctor.email}</span>
                    </div>
                    <button className="danger-btn" onClick={() => handleDeleteDoctor(doctor.id)}>
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
            {doctorAppointments.map((doctor) => (
              <div key={doctor.id} className="manage-card">
                <h3>{doctor.name}</h3>
                <p>{doctor.department} • {doctor.hospital}</p>
                {doctor.assigned.length === 0 ? (
                  <p className="muted">No assigned appointments.</p>
                ) : (
                  <ul className="appointment-list">
                    {doctor.assigned.map((item) => (
                      <li key={item.id}>
                        {item.patientName || 'Patient'} • {item.date} • {item.time} ({item.status})
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

export default AdminManageDoctors;
