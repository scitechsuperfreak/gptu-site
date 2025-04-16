self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("gptu-cache").then(cache => {
      return cache.addAll([
        "/index.html",
        "/teachcore.html",
        "/curriculum.html",
        "/nx-aeon-bio.html"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
