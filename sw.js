// Offline support: everything is served from the on-device cache first, so the app
// opens instantly with or without a connection. A fresh copy is fetched in the
// background and used the next time the app opens.
const CACHE = "tuner-v13-rotation";
const FILES = ["./", "index.html", "pitch.js", "manifest.webmanifest",
  "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE)
    .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const isPage = req.mode === "navigate";

  event.respondWith(caches.open(CACHE).then(async (cache) => {
    const cached = (await cache.match(req, { ignoreSearch: true }))
      || (isPage ? (await cache.match("./")) || (await cache.match("index.html")) : undefined);
    const fresh = fetch(req).then((res) => {
      if (res.ok) event.waitUntil(cache.put(isPage ? "./" : req, res.clone()));
      return res;
    }).catch(() => cached || Response.error());
    if (cached) { event.waitUntil(fresh.catch(() => {})); return cached; }
    return fresh;
  }));
});
