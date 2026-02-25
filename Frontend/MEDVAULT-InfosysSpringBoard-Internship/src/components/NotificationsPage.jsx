import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const navigate = useNavigate();

  const role = (localStorage.getItem('role') || 'patient').toLowerCase();

  const dashboardRoute = useMemo(() => {
    if (role === 'doctor') return '/doctor-dashboard';
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'master_admin') return '/master-admin-dashboard';
    return '/patient-dashboard';
  }, [role]);

  const roleLabel = useMemo(() => {
    if (role === 'doctor') return 'Doctor';
    if (role === 'admin') return 'Admin';
    if (role === 'master_admin') return 'Master Admin';
    return 'Patient';
  }, [role]);

  const notifications = useMemo(() => {
    const now = new Date().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });

    return [
      {
        id: 1,
        type: 'Upcoming Appointment',
        status: 'upcoming',
        unread: true,
        title: 'Upcoming appointment reminder',
        message: 'You have an appointment scheduled tomorrow. Please join 10 minutes early.',
        time: now
      },
      {
        id: 2,
        type: 'Reschedule Update',
        status: 'rescheduled',
        unread: true,
        title: 'Appointment was rescheduled',
        message: 'One of your appointments has been rescheduled. Please review the new time slot.',
        time: now
      },
      {
        id: 3,
        type: 'Cancellation Update',
        status: 'canceled',
        unread: true,
        title: 'Appointment cancellation update',
        message: 'An appointment was canceled. You can book a new slot from the bookings page.',
        time: now
      },
      {
        id: 4,
        type: 'General Update',
        status: 'info',
        unread: false,
        title: `${roleLabel} account update`,
        message: 'Your profile and preferences were synced successfully. No action is required.',
        time: now
      }
    ];
  }, [roleLabel]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const criticalCount = notifications.filter((item) => item.status === 'canceled').length;
  const scheduleCount = notifications.filter((item) => item.status === 'upcoming' || item.status === 'rescheduled').length;

  useEffect(() => {
    localStorage.setItem('unreadNotificationCount', String(unreadCount));
  }, [unreadCount]);

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div className="notifications-heading">
          <h1>Notifications</h1>
          <p>Upcoming appointments, reschedule or cancel updates, and other alerts.</p>
        </div>
        <button type="button" className="back-btn" onClick={() => navigate(dashboardRoute)}>
          Back to Dashboard
        </button>
      </header>

      <section className="notifications-stats">
        <article className="stat-chip">
          <span className="stat-label">New</span>
          <strong>{unreadCount}</strong>
        </article>
        <article className="stat-chip">
          <span className="stat-label">Schedule Updates</span>
          <strong>{scheduleCount}</strong>
        </article>
        <article className="stat-chip critical">
          <span className="stat-label">Critical</span>
          <strong>{criticalCount}</strong>
        </article>
      </section>

      <main className="notifications-main">
        {notifications.map((item) => (
          <article key={item.id} className={`notification-card ${item.status}`}>
            <div className="notification-top-row">
              <span className="notification-type">
                <span className="notification-dot" aria-hidden="true" />
                {item.type}
              </span>
              <span className="notification-time">{item.time}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.message}</p>
          </article>
        ))}
      </main>
    </div>
  );
};

export default NotificationsPage;
