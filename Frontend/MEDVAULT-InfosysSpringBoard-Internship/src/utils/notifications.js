export function _formatNow() {
  return new Date().toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function readNotifications() {
  try {
    const raw = localStorage.getItem('notifications');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeNotifications(list) {
  try {
    localStorage.setItem('notifications', JSON.stringify(list));
    localStorage.setItem('unreadNotificationCount', String(list.filter(n => n.unread).length));
  } catch (e) {
    // ignore
  }
}

export function addNotification({ type = 'General', status = 'info', title = '', message = '' } = {}) {
  const list = readNotifications();
  const id = Date.now();
  const role = (localStorage.getItem('role') || 'patient').toLowerCase();
  const roleLabel = role === 'doctor' ? 'Doctor' : role === 'admin' ? 'Admin' : role === 'master_admin' ? 'Master Admin' : 'Patient';

  const notification = {
    id,
    type,
    status,
    unread: true,
    title: title || `${roleLabel} notification`,
    message: message || '',
    time: _formatNow()
  };

  // newest first
  const next = [notification, ...list];
  writeNotifications(next);
  return notification;
}

export function clearNotifications() {
  writeNotifications([]);
}

export function markAllRead() {
  const list = readNotifications().map(n => ({ ...n, unread: false }));
  writeNotifications(list);
  return list;
}

export function getNotifications() {
  return readNotifications();
}
