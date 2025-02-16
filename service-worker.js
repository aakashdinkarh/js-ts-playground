// Cache configuration
const CACHE_NAME = 'js-ts-playground-cache-v1';
const REGULAR_CACHE_EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const LONG_CACHE_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Get the base path for GitHub Pages
// eslint-disable-next-line no-restricted-globals
const BASE_PATH = self.location.pathname.replace('service-worker.js', '');

// Cache types
const CACHE_TYPES = {
    LONG: 'long',
    REGULAR: 'regular'
};

// Header names
const HEADERS = {
    TIMESTAMP: 'sw-timestamp',
    CACHE_TYPE: 'sw-cache-type',
    CONTENT_TYPE: 'Content-Type'
};

// URL schemes
const URL_SCHEMES = {
    CHROME_EXTENSION: 'chrome-extension://',
    DATA: 'data:'
};

// File paths and extensions
const PATHS = {
    ROOT: BASE_PATH,
    INDEX: `${BASE_PATH}index.html`,
    MANIFEST: `${BASE_PATH}manifest.json`,
    FAVICON: `${BASE_PATH}favicon.ico`,
    LOGO_192: `${BASE_PATH}logo192.png`,
    LOGO_512: `${BASE_PATH}logo512.png`
};

const FILE_EXTENSIONS = {
    HTML: 'html',
    JS: 'js',
    CSS: 'css',
    PNG: 'png',
    JPG: 'jpg',
    JPEG: 'jpeg',
    SVG: 'svg',
    GIF: 'gif',
    JSON: 'json',
    WOFF: 'woff',
    WOFF2: 'woff2',
    TTF: 'ttf',
    EOT: 'eot'
};

// Monaco Editor CDN base URL
const MONACO_CDN_BASE = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs';
const CDN_BASE = 'https://cdn';

// Assets that should be cached immediately during installation
const PRECACHE_URLS = [
    PATHS.ROOT,
    PATHS.INDEX,
    PATHS.MANIFEST,
    PATHS.FAVICON,
    PATHS.LOGO_192,
    PATHS.LOGO_512
];

// CDN URLs that should be cached with longer expiration
const CDN_URLS = [
    `${MONACO_CDN_BASE}/loader.js`,
    `${MONACO_CDN_BASE}/editor/editor.main.js`,
    `${MONACO_CDN_BASE}/editor/editor.main.css`,
    `${MONACO_CDN_BASE}/editor/editor.main.nls.js`,
    `${MONACO_CDN_BASE}/basic-languages/javascript/javascript.js`,
    `${MONACO_CDN_BASE}/basic-languages/typescript/typescript.js`,
    `${MONACO_CDN_BASE}/language/typescript/tsMode.js`,
    `${MONACO_CDN_BASE}/base/worker/workerMain.js`,
    `${MONACO_CDN_BASE}/base/worker/workerMain.js`,
    `${MONACO_CDN_BASE}/base/common/worker/simpleWorker.nls.js`,
    `${MONACO_CDN_BASE}/language/typescript/tsWorker.js`,
    'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.7.3/typescript.min.js',
];

// File extensions we want to cache
const CACHEABLE_EXTENSIONS = Object.values(FILE_EXTENSIONS);

// Helper function to check if a URL is in our CDN list
function isCdnUrl(url) {
    return url.startsWith(CDN_BASE);
}

// Helper function to check if a request should be cached
function shouldCache(url) {
    // Always cache if it's in our CDN list
    if (isCdnUrl(url)) return true;

    // Don't cache chrome-extension requests
    if (url.startsWith(URL_SCHEMES.CHROME_EXTENSION)) return false;
    
    // Don't cache data: URLs
    if (url.startsWith(URL_SCHEMES.DATA)) return false;

    // For same-origin requests, cache based on extension
    // eslint-disable-next-line no-restricted-globals
    if (new URL(url).origin === self.location.origin) {
        // Cache if the file extension matches our cacheable list
        const extension = url.split('.').pop()?.toLowerCase();
        if (extension && CACHEABLE_EXTENSIONS.includes(extension)) return true;

        // Cache if it's a root path or HTML file
        if (url.endsWith(PATHS.ROOT) || url.includes(`.${FILE_EXTENSIONS.HTML}`)) return true;
    }

    return false;
}

// Helper function to store data with a timestamp
async function cacheWithTimestamp(request, response) {
    const cache = await caches.open(CACHE_NAME);
    const timestampedResponse = new Response(response.body, {
        ...response,
        headers: new Headers(response.headers)
    });
    
    // Use longer expiration for CDN files
    const timestamp = Date.now().toString();
    timestampedResponse.headers.set(HEADERS.TIMESTAMP, timestamp);
    timestampedResponse.headers.set(
        HEADERS.CACHE_TYPE, 
        isCdnUrl(request.url) ? CACHE_TYPES.LONG : CACHE_TYPES.REGULAR
    );
    
    await cache.put(request, timestampedResponse);
}

// Helper function to check if a cached item is expired
function isCacheExpired(response) {
    const cachedTime = response.headers.get(HEADERS.TIMESTAMP);
    const cacheType = response.headers.get(HEADERS.CACHE_TYPE);
    const expirationTime = cacheType === CACHE_TYPES.LONG 
        ? LONG_CACHE_EXPIRATION_TIME 
        : REGULAR_CACHE_EXPIRATION_TIME;
    
    return cachedTime ? (Date.now() - parseInt(cachedTime)) > expirationTime : true;
}

// Install event - cache initial assets
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            try {
                // Cache local assets
                await cache.addAll(PRECACHE_URLS);
                
                // Cache CDN files
                await Promise.allSettled(
                    CDN_URLS.map(async (url) => {
                        const response = await fetch(url);
                        if (response.ok) {
                            await cacheWithTimestamp(new Request(url), response);
                        }
                    })
                );
                
                console.dir({
                  message: 'Precache successful',
                  type: 'log'
                })
            } catch (error) {
                console.dir({
                  message: `Precache failed: ${error?.message}`,
                  error: error,
                  type: 'error'
                })
            }
        })
    );
    // Activate immediately
    // eslint-disable-next-line no-restricted-globals
    self.skipWaiting();
});

// Fetch event with cache strategy
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', event => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    const url = event.request.url;
    if (!shouldCache(url)) return;

    event.respondWith(
        caches.match(event.request).then(async (cachedResponse) => {
            // Return valid cached response
            if (cachedResponse && !isCacheExpired(cachedResponse)) {
                return cachedResponse;
            }

            try {
                // Get fresh response from network
                const networkResponse = await fetch(event.request);
                
                // Clone the response before using it
                const responseToCache = networkResponse.clone();
                
                // Cache the fresh response
                if (networkResponse.ok) {
                    await cacheWithTimestamp(event.request, responseToCache);
                }
                
                return networkResponse;
            } catch (error) {
                // Return expired cached response if network fails
                if (cachedResponse) {
                    console.dir({
                      message: 'Returning expired cache due to network error',
                      type: 'log'
                    })
                    return cachedResponse;
                }
                
                // If no cached response, return error response
                return new Response('Network error occurred', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            }
        })
    );
});

// Activate event to clean up old caches
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Claim all clients
            // eslint-disable-next-line no-restricted-globals, no-undef
            clients.claim()
        ])
    );
}); 
