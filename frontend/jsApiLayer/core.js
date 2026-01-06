const API_BASE = '/api';//'https://viniciusbarroscanonico.com/api';
const CACHE_TTL = 10 * 1000; // 10 seconds
const VERBOSE = true;

const apiCache = new Map();

function log_verbose(...messages) {
    if (VERBOSE) {
        console.log('[API VERBOSE]', ...messages);
    }
}

function makeCacheKey(method, url, body = null) {
    log_verbose('makeCacheKey:', method, url, body ? 'with body' : 'no body');
    if (body) {
        try {
            return `${method}:${url}:${JSON.stringify(body)}`;
        } catch (err) {
            log_verbose('makeCacheKey: body stringify failed:', err);
            return `${method}:${url}`;
        }
    }
    return `${method}:${url}`;
}

function invalidateCache(endpoints) {
    if (!endpoints || !endpoints.length) return;
    log_verbose('Invalidating cache for:', endpoints);
    apiCache.forEach((_, key) => {
        for (const ep of endpoints) {
            if (key.includes(ep)) {
                apiCache.delete(key);
                log_verbose('Invalidated key:', key);
                break;
            }
        }
    });
}

function readCache(key) {
    log_verbose('readCache attempt:', key);
    const entry = apiCache.get(key);
    if (!entry) {
        log_verbose('Cache miss: no entry');
        return null;
    }
    const age = Date.now() - entry.timestamp;
    if (age > CACHE_TTL) {
        log_verbose('Cache stale:', age, 'ms > TTL');
        apiCache.delete(key);
        return null;
    }
    log_verbose('Cache hit:', age, 'ms old');
    return entry.data;
}

function saveCache(key, data) {
    log_verbose('saveCache:', key);
    apiCache.set(key, { timestamp: Date.now(), data });
}

export async function apiFetch(endpoint, options = {}) {
    const method = options.method || 'GET';
    const url = `${API_BASE}${endpoint}`;
    const bodyObj = options.body ? JSON.parse(options.body) : null;
    const key = makeCacheKey(method, url, bodyObj);
    const forceIgnoreCache = options.force_ignore_cache === true;
    const invalidateAfter = options.invalidate_after || [];

    log_verbose('>>> apiFetch START', method, url);
    log_verbose('Options:', { force_ignore_cache: forceIgnoreCache, invalidate_after: invalidateAfter });

    if (!forceIgnoreCache) {
        const cached = readCache(key);
        if (cached !== null) {
            log_verbose('Returning cached data');
            return cached;
        }
    } else {
        log_verbose('force_ignore_cache=true → skipping cache read');
    }

    const token = localStorage.getItem('token');
    log_verbose('Token present:', !!token);

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    log_verbose('Fetching from backend...');
    try {
        const response = await fetch(url, { ...options, headers });
        log_verbose('Response status:', response.status);

        const data = await response.json().catch(() => ({}));
        log_verbose('Parsed response data:', data);

        if (!response.ok) {
            log_verbose('Backend error response');
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        log_verbose('Backend success');
        if (!forceIgnoreCache) {
            saveCache(key, data);
        } else {
            log_verbose('Skipped caching due to force_ignore_cache');
        }

        if (invalidateAfter.length) {
            invalidateCache(invalidateAfter);
        }

        return data;
    } catch (err) {
        log_verbose('Fetch error:', err);
        throw err;
    }
}