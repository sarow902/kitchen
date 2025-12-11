const VERSION = "1";
const CACHE_NAME = `saraKitchen-v${VERSION}`;

const APP_STATIC_RESOURCES = [
  './index.html',
  './404.html',
  './css/style.css',
  './images/Logo.png',
  './images/fav_icon.svg',
  './images/defaultProduct.jpg',
  './images/defaultProduct2.jpg',
  './js/script.js',
  './js/products.json',
  './js/locals.json',
  './sounds/ding'
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
    self.skipWaiting()
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (APP_STATIC_RESOURCES.includes(url.pathname)) {
    /*event.respondWith(cacheFirst(event.request));*/
    event.respondWith(networkFirst(event.request));
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return undefined;
        }),
      );
      //await self.clients.claim();
    })(),
  );
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return Response.error();
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || Response.error();
  }
}

