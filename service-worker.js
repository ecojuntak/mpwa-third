importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  '/css/materialize.css',
  '/css/materialize.min.css',
  '/js/api.js',
  '/js/db.js',
  '/js/idb.js',
  '/js/materialize.js',
  '/js/materialize.min.js',
  '/js/nav.js',
  '/js/view-helper.js',
  '/images/404.jpg',
  '/images/bdc.jpeg',
  '/images/empty-bookmark.png',
  '/images/icon.png',
  '/images/pwa.png',
  '/nav.html',
  '/index.html',
  '/manifest.json'
]);

workbox.strategies.cacheFirst({
  cacheName: 'images',
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 20,
      maxAgeSeconds: 5 * 24 * 60 * 60
    }),
  ],
}),

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg)$/,
  workbox.strategies.cacheFirst()
);

self.addEventListener('push', event => {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Hello from MainBola';
  }

  var options = {
    body: body,
    icon: 'images/icon.png',
    vibrate: [50, 75, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('MainBola', options)  
  );
});