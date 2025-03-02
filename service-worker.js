const CACHE_NAME = 'streamlist-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/main.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

this.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

this.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.forEach((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

this.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request);
            })
    );
});
