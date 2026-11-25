/* Coffre à codes : fonctionne sans Internet. Aucun code ni document ne passe par ce fichier. */
const C = "coffre-v2";
const F = ["./coffre.html", "./coffre.webmanifest", "./coffre-192.png", "./coffre-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(F)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith("coffre-") && x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  /* lecteur de PDF : gardé après le premier usage avec Internet */
  if (u.hostname === "cdn.jsdelivr.net" && u.pathname.includes("/pdfjs-dist@")) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(x => { const c = x.clone(); caches.open(C).then(k => k.put(e.request, c)); return x; })));
    return;
  }
  if (!/\/coffre[^/]*$/.test(u.pathname)) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(C).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
