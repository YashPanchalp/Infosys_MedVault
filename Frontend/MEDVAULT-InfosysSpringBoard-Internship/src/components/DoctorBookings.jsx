import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorBookings.css";

const formatDateLabel = (dateValue) => {
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
};

const formatTimeLabel = (timeValue) => {
  if (!timeValue) return "";
  const [hours = "0", minutes = "0"] = (timeValue || "").split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getInitials = (name) => {
  if (!name) return "P";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const DoctorBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [rejectReasons, setRejectReasons] = useState({});
  const [rejectErrors, setRejectErrors] = useState({});
  const [rejectOpen, setRejectOpen] = useState({});

  const getToken = () => localStorage.getItem("token");

  // ✅ FETCH FROM BACKEND
  const fetchAppointments = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn("No auth token found");
        return;
      }
      const response = await axios.get("/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Appointments:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // TAB CONTROL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
   if (tab === "pending" || tab === "approved" || tab === "completed" || tab === "all") {
      setActiveTab(tab);
    }
  }, [location.search]);

  const pendingAppointments = useMemo(
    () => appointments.filter((item) => item.status === "PENDING"),
    [appointments]
  );

  const approvedAppointments = useMemo(
    () => appointments.filter((item) => item.status === "APPROVED"),
    [appointments]
  );

  const rejectedAppointments = useMemo(
    () => appointments.filter((item) => item.status === "REJECTED"),
    [appointments]
  );

  const handleComplete = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error("No auth token");

    await axios.put(
      `/api/doctor/appointments/${id}/status`,
      { status: "COMPLETED" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await fetchAppointments();
  } catch (error) {
    console.error("Complete failed", error);
  }
};

  const analytics = useMemo(() => {
    const upcoming = approvedAppointments
      .map((item) => {
        let dateTime = null;
        if (item.appointmentDate && item.appointmentTime) {
          const temp = new Date(`${item.appointmentDate}T${item.appointmentTime}`);
          if (!Number.isNaN(temp.getTime())) dateTime = temp;
        }
        return { ...item, dateTime };
      })
      .filter((i) => i.dateTime)
      .sort((a, b) => a.dateTime - b.dateTime);

    return {
      approvedCount: approvedAppointments.length,
      pendingCount: pendingAppointments.length,
      rejectedCount: rejectedAppointments.length,
      nextAppointment: upcoming[0] || null,
    };
  }, [approvedAppointments, pendingAppointments, rejectedAppointments]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/doctor-bookings?tab=${tab}`);
  };

  // ✅ APPROVE (BACKEND CALL)
  const handleApprove = async (id) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No auth token");
      await axios.put(
        `/api/doctor/appointments/${id}/status`,
        { status: "APPROVED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchAppointments();
    } catch (error) {
      console.error("Approve failed", error);
    }
  };

  // ✅ REJECT (BACKEND CALL)
  const handleReject = async (id) => {
    const reason = (rejectReasons[id] || "").trim();
    if (!reason) {
      setRejectErrors((prev) => ({ ...prev, [id]: "Please add a reason." }));
      return;
    }

    try {
      const token = getToken();
      if (!token) throw new Error("No auth token");
      await axios.put(
        `/api/doctor/appointments/${id}/status`,
        { status: "REJECTED", reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchAppointments();
      setRejectOpen((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error("Reject failed", error);
    }
  };

  const handleRejectToggle = (id) => {
    if (!rejectOpen[id]) {
      setRejectOpen((prev) => ({ ...prev, [id]: true }));
      return;
    }
    handleReject(id);
  };

  const completedAppointments = useMemo(
  () => appointments.filter((item) => item.status === "COMPLETED"),
  [appointments]
);

  return (
    <div className="doctor-bookings-page">
      <header className="bookings-header">
        <div>
          <h1>Appointment Management</h1>
          <p>Review, approve, and schedule patient appointments.</p>
        </div>
        <div className="bookings-header-actions">
          <button className="ghost-btn" onClick={() => navigate('/doctor-patient-registry')}>
            Patient Registry
          </button>
          <button className="ghost-btn" onClick={() => navigate('/doctor-appointments/all')}>
            View All Appointments
          </button>
          <button className="primary-btn" onClick={() => navigate('/doctor-appointments/reschedule')}>
            Reschedule Appointment
          </button>
          <button className="ghost-btn" onClick={() => navigate("/doctor-dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="booking-tabs">
  <button onClick={() => handleTabChange("pending")}>Pending</button>
  <button onClick={() => handleTabChange("approved")}>Approved</button>
  <button onClick={() => handleTabChange("completed")}>Completed</button>
  <button onClick={() => handleTabChange("all")}>All</button>
</div>

      <section className="analytics-strip">
        <article className="analytics-card">
          <span>Approved</span>
          <h3>{analytics.approvedCount}</h3>
          <p>Confirmed appointments</p>
        </article>
        <article className="analytics-card">
          <span>Pending</span>
          <h3>{analytics.pendingCount}</h3>
          <p>Awaiting decision</p>
        </article>
        <article className="analytics-card">
          <span>Rejected</span>
          <h3>{analytics.rejectedCount}</h3>
          <p>Declined requests</p>
        </article>
        <article className="analytics-card">
          <span>Next Slot</span>
          <h3>
            {analytics.nextAppointment
              ? formatDateLabel(analytics.nextAppointment.appointmentDate)
              : "None"}
          </h3>
          <p>
            {analytics.nextAppointment
              ? formatTimeLabel(analytics.nextAppointment.appointmentTime)
              : "No upcoming approved"}
          </p>
        </article>
      </section>

      {activeTab === "pending" && (
        <section className="bookings-section">
          <h2>Pending Requests</h2>
          {pendingAppointments.length === 0 ? (
            <div className="empty-state">
              <h3>No pending appointments</h3>
              <p className="muted">New booking requests will appear here.</p>
            </div>
          ) : (
            <div className="appointments-list">
              {pendingAppointments.map((item) => (
                <article key={item.id} className="appointment-card pending-card">
                  <div className="appointment-main">
                    <div className="patient-profile">
                      <div className="patient-avatar">{getInitials(item.patientName)}</div>
                      <div>
                        <h3>{item.patientName}</h3>
                        <p>
                          {formatDateLabel(item.appointmentDate)} • {formatTimeLabel(item.appointmentTime)}
                        </p>
                      </div>
                    </div>
                    <div className="appointment-note">
                      <span>Reason</span>
                      <p>{item.reason || "Not provided"}</p>
                    </div>
                    <span className="status-pill pending">Pending</span>
                  </div>

                  <div className="appointment-actions">
                    <div className="action-buttons">
                      <button className="primary-btn" onClick={() => handleApprove(item.id)}>
                        Approve
                      </button>
                      <button className="danger-btn" onClick={() => handleRejectToggle(item.id)}>
                        {rejectOpen[item.id] ? "Confirm Reject" : "Reject"}
                      </button>
                    </div>
                    {rejectOpen[item.id] && (
                      <div className="reject-panel">
                        <label htmlFor={`reject-reason-${item.id}`}>Rejection Reason</label>
                        <textarea
                          id={`reject-reason-${item.id}`}
                          value={rejectReasons[item.id] || ""}
                          onChange={(e) =>
                            setRejectReasons((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          placeholder="Add rejection reason"
                        />
                        {rejectErrors[item.id] && (
                          <div className="feedback error">{rejectErrors[item.id]}</div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "approved" &&
  approvedAppointments.map((item) => (
    <div key={item.id} className="appointment-card">
      <h3>{item.patientName}</h3>
      <p>
        {formatDateLabel(item.appointmentDate)} -{" "}
        {formatTimeLabel(item.appointmentTime)}
      </p>

      <button
        className="complete-btn"
        onClick={() => handleComplete(item.id)}
      >
        Mark as Completed
      </button>
    </div>
  ))}

  {activeTab === "completed" &&
  completedAppointments.map((item) => (
    <div key={item.id} className="appointment-card completed-card">
      <h3>{item.patientName}</h3>
      <p>
        {formatDateLabel(item.appointmentDate)} -{" "}
        {formatTimeLabel(item.appointmentTime)}
      </p>
      <span className="status-badge completed">Completed</span>
    </div>
  ))}

      {activeTab === "all" && (
        <section className="bookings-section">
          <h2>All Appointments</h2>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <h3>No appointments found</h3>
              <p className="muted">Appointments will appear here when patients book slots.</p>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((item) => (
                <article key={item.id} className="appointment-row">
                  <div className="appointment-main">
                    <h3>{item.patientName}</h3>
                    <p>{item.reason || "No reason added"}</p>
                  </div>
                  <div className="appointment-meta">
                    <span>{formatDateLabel(item.appointmentDate)}</span>
                    <span>{formatTimeLabel(item.appointmentTime)}</span>
                  </div>
                  <span className={`status-pill ${(item.status || "").toLowerCase()}`}>
                    {item.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DoctorBookings;
