const CACHE_NAME = 'reemas-fit-v3';
const BASE = '/Remas-Fitness';

const PAGES = [
  `${BASE}/index.html`,
  `${BASE}/saturday.html`,
  `${BASE}/sunday.html`,
  `${BASE}/monday.html`,
  `${BASE}/tuesday.html`,
  `${BASE}/wednesday.html`,
  `${BASE}/my-journey.html`,
  `${BASE}/style.css`
];

// تثبيت — نحفظ كل الصفحات في الكاش
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PAGES))
  );
  self.skipWaiting();
});

// تفعيل — نحذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// طلب — نجيب من الكاش أولاً، لو ما لقينا نجيب من النت
self.addEventListener('fetch', e => {
  // نتجاهل طلبات خارج نطاق الموقع
  if (!e.request.url.includes(BASE)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        // نحفظ الصور في الكاش تلقائياً
        if (e.request.url.includes('/images/') || e.request.url.includes('/icons/')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // لو ما في إنترنت — نرجع الرئيسية من الكاش
        if (e.request.destination === 'document') {
          return caches.match(`${BASE}/index.html`);
        }
      });
    })
  );
});
