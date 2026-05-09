// Zonnewijzer Pro — Service Worker v4.0
// Strategie: Cache-First met netwerk-fallback
// Offline: volledig functioneel

const CACHE_NAME   = 'zonnewijzer-v5';
const CACHE_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './suncalc.js',
    './manifest.json',
    './sw.js',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);
    // Live data — niet cachen
    if (url.hostname.includes('nominatim.openstreetmap.org')) return;
    if (url.hostname.includes('openweathermap.org')) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) {
                // Cache-first: geef gecachede versie, update op achtergrond
                fetch(event.request).then(nr => {
                    if (nr && nr.status === 200)
                        caches.open(CACHE_NAME).then(c => c.put(event.request, nr.clone()));
                }).catch(() => {});
                return cached;
            }
            return fetch(event.request)
                .then(nr => {
                    if (!nr || nr.status !== 200 || nr.type === 'opaque') return nr;
                    // Clone EERST voor cache, geef origineel terug
                    const toCache = nr.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, toCache));
                    return nr;
                })
                .catch(() => caches.match('./index.html'));
        })
    );
});

// Message handler — voorkomt "channel closed" waarschuwingen van browser extensies
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
