const CACHE_NAME = 'fssai-qr-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './app_icon.png'
];

// Install Service Worker and Cache Assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Cache-first strategies for loading local assets
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
