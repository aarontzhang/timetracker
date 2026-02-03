const CACHE_NAME = 'timetrack-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { delay, intervalHours } = event.data;
    setTimeout(() => {
      self.registration.showNotification('TimeTrack', {
        body: `What did you do in the last ${intervalHours} hour${intervalHours > 1 ? 's' : ''}?`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'timetrack-checkin',
        requireInteraction: true
      });
    }, delay);
  }
});
