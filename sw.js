const CACHE = 'reemas-fit-v1';

const FILES = [
  '/',
  '/index.html',
  '/saturday.html',
  '/sunday.html',
  '/monday.html',
  '/tuesday.html',
  '/wednesday.html',
  '/my-journey.html',
  '/style.css',
  '/images/bike.jpg',
  '/images/Chest Fly.jpg',
  '/images/Dumbbell Press.jpg',
  '/images/Push-Up.jpg',
  '/images/Pullover.jpg',
  '/images/Flat Fly.jpg',
  '/images/Goblet Squat.jpg',
  '/images/Hip Thrust.jpg',
  '/images/Reverse Lunge.jpg',
  '/images/Donkey Kick.jpg',
  '/images/Clamshell.jpg',
  '/images/Single Leg Bridge.jpg',
  '/images/Pigeon Pose.jpg',
  '/images/Hamstring stretch.jpg',
  '/images/Side bend with dumbbell.jpg',
  '/images/Russian twist.jpg',
  '/images/Side Bend.jpg',
  '/images/Plank.jpg',
  '/images/Scissor Kicks.jpg',
  '/images/Knee Tucks.jpg',
  '/images/Bicycle Crunch.jpg',
  '/images/High Knees.jpg',
  '/images/Pulse Squat.jpg',
  '/images/Standing Kickback.jpg',
  '/images/Superman stretch.jpg'
];

// تثبيت — حفظ كل الملفات
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// تنشيط — حذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// طلب — من الكاش أولاً، ثم الشبكة
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if (!res || res.status !== 200) return res;
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => cached);
    })
  );
});