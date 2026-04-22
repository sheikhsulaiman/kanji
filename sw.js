const CACHE = 'kanji-v1';
const ASSETS = [
  '/kanji/',
  '/kanji/index.html',
  '/kanji/site.webmanifest',
  '/kanji/favicon.ico',
  '/kanji/favicon-16x16.png',
  '/kanji/favicon-32x32.png',
  '/kanji/android-chrome-192x192.png',
  '/kanji/android-chrome-512x512.png',
  '/kanji/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&family=Noto+Sans+JP:wght@400;700;900&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/kanji/'));
    })
  );
});
