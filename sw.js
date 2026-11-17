// Königs Grill 2 Münster – macht die App installierbar und offline nutzbar.
// Strategie: immer zuerst das Netz (damit Preise aktuell sind), sonst die gespeicherte Kopie.
const SPEICHER = 'kg2-v4';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(SPEICHER).then(c => c.addAll(['./', 'manifest.webmanifest', 'img/krone.svg', 'img/icon-192.png', 'fonts/fonts.css', 'fonts/bebasneue-latin.woff2', 'fonts/montserrat-latin.woff2']))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SPEICHER).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const kopie = r.clone(); caches.open(SPEICHER).then(c => c.put(e.request, kopie)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./'))));
});
