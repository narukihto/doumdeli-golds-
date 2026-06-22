// ==========================================
// 1. CONFIGURATION DU NOYAU DE CACHE GOLD PRESTIGE
// ==========================================
// تحديث اسم الكاش والإصدار لضمان تنظيف مخلفات السلع القديمة وتفعيل منصة الذهب
const CACHE_NAME = 'doumdeli-gold-v5';

// المصفوفة الكبرى لتخزين أصول منصة الذهب لضمان عمل المتجر بالكامل Offline في أي مكان بأفريقيا
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',

  // --- IMAGES & MEDIAS : COFFRETS DE LUXE & JOAILLERIE ---
  // تم تجهيز المسارات لاستقبال الصور والفيديوهات الخاصة بك فور وضعها في المجلدات
  './images/parure1.jpg',
  './images/parure2.jpg',
  './images/bracelet1.jpg',
  './images/bracelet2.jpg',
  './images/bague1.jpg',
  './images/bague2.jpg',
  './images/collier1.jpg',
  './images/collier2.jpg',
  './images/boucles1.jpg',

  // --- VIDEOS EXHIBITIONS (الاستعراضات المرئية للذهب) ---
  './videos/parure1.mp4',
  './videos/parure2.mp4',
  './videos/bracelet1.mp4',
  './videos/bracelet2.mp4',
  './videos/bague1.mp4',
  './videos/bague2.mp4',
  './videos/collier1.mp4',
  './videos/collier2.mp4',
  './videos/boucles1.mp4'
];

// ==========================================
// 2. ÉVÉNEMENT 'INSTALL' : CAPTURE DES ASSETS DE LUXE
// ==========================================
self.addEventListener('install', (e) => {
  console.log('👑 [Service Worker] Installation et mise en cache des dimensions Gold...');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // إجبار التثبيت على المتابعة وسحب الملفات الأساسية حتى لو تأخرت بعض الفيديوهات أو الصور
      return cache.addAll(STATIC_ASSETS)
        .then(() => console.log('✅ [Service Worker] Tous les bijoux précieux sont sécurisés dans le cache !'))
        .catch(err => console.log('⚠️ [Service Worker] Note: Certains médias ne sont pas encore présents dans vos dossiers, installation fluide maintenue.', err));
    })
  );
  // تفعيل السيرفس وركر فوراً في الخلفية
  self.skipWaiting();
});

// ==========================================
// 3. ÉVÉNEMENT 'ACTIVATE' : PURGE COMPLETE DES ANCIENS SITES
// ==========================================
self.addEventListener('activate', (e) => {
  console.log('⚡ [Service Worker] Activation du noyau Gold et nettoyage des anciens stocks...');
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // مسح كاش 'doumdeli-space-v3' وأي كاش قديم لتجنب خلط السلع السابقة مع الذهب
          if (key !== CACHE_NAME) {
            console.log(`🗑️ [Service Worker] Suppression de l'ancien cache obsolète : ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // السيطرة الفورية على جميع التبويبات المفتوحة
  return self.clients.claim();
});

// ==========================================
// 4. ÉVÉNEMENT 'FETCH' : STRATÉGIE PANAFRICAINE HORS-LIGNE
// ==========================================
self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // تحديث الكاش تلقائياً وديناميكياً عند وجود اتصال بالإنترنت
        if (response.status === 200) {
          const isGoldMedia = e.request.url.includes('images') || e.request.url.includes('videos');
          const isGlobalMedia = e.request.destination === 'image' || e.request.destination === 'video';

          if (isGoldMedia || isGlobalMedia) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseClone);
              console.log(`📥 [Service Worker] Or Prestige mis à jour en tâche de fond : ${e.request.url}`);
            });
          }
        }
        return response;
      })
      .catch((error) => { 
        // حبل النجاة عند انقطاع التغطية في أفريقيا (العمل بالكامل بدون إنترنت من الكاش)
        console.log(`📡 [Service Worker] Mode Continental Hors-ligne activé pour : ${e.request.url}`);
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // إذا كانت صورة مفقودة ولم يتم كاشها بعد، نعرض خلفية مجوهرات الذهب الفاخرة الاحتياطية تلقائياً
          if (e.request.destination === 'image') {
            return caches.match('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600')
              .then(fallbackResponse => fallbackResponse || new Response('', { status: 404, statusText: 'Not Found' }));
          }
        });
      })
  );
});