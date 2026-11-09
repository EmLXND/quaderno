// Offline support for Quaderno.
// The page is fetched network-first (with a short timeout, falling back to the saved copy),
// so new versions arrive as soon as there is a connection. Fonts, icons and the manifest are
// cache-first. The update check (?check=…) always goes straight to the network.
// Bump CACHE only when the ASSETS list changes; index.html changes need no bump here.
const CACHE = 'quaderno-1';
const ASSETS = [
  './',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'fonts/fraunces-latin-opsz-normal.woff2',
  'fonts/figtree-latin-wght-normal.woff2',
];
const PAGE = new URL('./', self.location).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.searchParams.has('check')) return;
  const isPage = req.mode === 'navigate' || url.href.split('?')[0] === PAGE || url.pathname.endsWith('/index.html');
  e.respondWith(isPage ? page(url) : asset(req));
});

// newest page if the network answers within 2.5 s, otherwise the saved copy
function page(url) {
  const net = fetch(url.href, { cache: 'no-cache' }).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(PAGE, copy)); }
    return res;
  });
  net.catch(() => {});
  const saved = caches.match(PAGE);
  const slow = new Promise(r => setTimeout(r, 2500)).then(() => saved);
  return Promise.race([net, slow])
    .then(res => res || net)
    .catch(() => saved.then(res => res || Response.error()));
}

function asset(req) {
  return caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }));
}
