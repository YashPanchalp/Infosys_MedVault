import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './DoctorRescheduleAppointment.css';


const DoctorRescheduleAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get('id');

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(selectedId || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
  const load = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/doctor/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data || [];

      // filter immediately here instead of using useMemo
      const filtered = data.filter(
  (item) => item.status?.toUpperCase() === 'APPROVED'
);

      setAppointments(filtered);

      // Set default selected only once
      if (!selectedId && filtered.length > 0) {
        setSelectedAppointmentId(String(filtered[0].id));
      }

    } catch (error) {
      console.error('Failed to load appointments', error);
    }
  };

  load();
}, []);

  const selectedAppointment = appointments.find(
  (item) => String(item.id) === String(selectedAppointmentId)
);

  const handleSubmit = async (event) => {
  event.preventDefault();
  setFeedback('');

  if (!selectedAppointmentId || !date || !time) {
    setFeedback('Please select appointment, date, and time.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setFeedback('Unauthorized. Please login again.');
      return;
    }

    await axios.post(
  '/api/doctor/appointments/reschedule',
  {
    appointmentId: Number(selectedAppointmentId), // ✅ convert to number
    date,
    time,
    note
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

    setFeedback('Appointment rescheduled successfully.');
setTimeout(() => {
  navigate('/doctor-dashboard');
}, 1000);
    setDate('');
    setTime('');
    setNote('');

  } catch (error) {
    console.error('Reschedule failed', error);
    setFeedback('Failed to reschedule appointment.');
  }
};

  return (
    <div className="doctor-reschedule-page">
      <header className="reschedule-header">
        <div>
          <h1>Reschedule Appointment</h1>
          <p>Select an appointment and assign a new preferred slot.</p>
        </div>
        <button className="ghost-btn" onClick={() => navigate('/doctor-appointments/all')}>
          View All Appointments
        </button>
      </header>

      <section className="reschedule-card">
        <form className="reschedule-form" onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label htmlFor="appointment">Appointment</label>
            <select
  id="appointment"
  value={selectedAppointmentId}
  onChange={(e) => setSelectedAppointmentId(e.target.value)}
  required
>
  {appointments.map((item) => (
    <option key={item.id} value={item.id}>
      {item.patientName || 'Patient'} • {item.appointmentDate} {item.appointmentTime}
    </option>
  ))}
</select>
          </div>

          <div className="form-group">
            <label htmlFor="newDate">New Date</label>
            <input
              id="newDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newTime">New Time</label>
            <input
              id="newTime"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="note">Note (Optional)</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Reason for rescheduling"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="ghost-btn" onClick={() => navigate('/doctor-bookings')}>
              Back
            </button>
            <button type="submit" className="primary-btn">Save Reschedule</button>
          </div>

          {feedback ? <p className="feedback-text">{feedback}</p> : null}
        </form>

        {selectedAppointment ? (
          <aside className="appointment-preview">
            <h3>Selected Appointment</h3>
            <p><strong>Patient:</strong> {selectedAppointment.patientName || 'Patient'}</p>
            <p><strong>Current Date:</strong> {selectedAppointment.appointmentDate}</p>
            <p><strong>Current Time:</strong> {selectedAppointment.appointmentTime}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
          </aside>
        ) : null}
      </section>
    </div>
  );
};

export default DoctorRescheduleAppointment;
