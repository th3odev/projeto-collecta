const API_BASE = "/api"; // proxy da Vercel → backend
const CACHE_TTL = 10 * 1000; // 10s
const VERBOSE = true;

const apiCache = new Map();

/* =======================
   LOG
======================= */
function log_verbose(...messages) {
  if (VERBOSE) {
    console.log("[API VERBOSE]", ...messages);
  }
}

/* =======================
   CACHE
======================= */
function makeCacheKey(method, url, body = null) {
  if (body) {
    try {
      return `${method}:${url}:${JSON.stringify(body)}`;
    } catch {
      return `${method}:${url}`;
    }
  }
  return `${method}:${url}`;
}

function readCache(key) {
  const entry = apiCache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > CACHE_TTL) {
    apiCache.delete(key);
    return null;
  }

  return entry.data;
}

function saveCache(key, data) {
  apiCache.set(key, { timestamp: Date.now(), data });
}

function invalidateCache(endpoints = []) {
  if (!endpoints.length) return;

  apiCache.forEach((_, key) => {
    if (endpoints.some((ep) => key.includes(ep))) {
      apiCache.delete(key);
    }
  });
}

/* =======================
   API FETCH
======================= */
export async function apiFetch(endpoint, options = {}) {
  const method = options.method || "GET";
  const url = `${API_BASE}${endpoint}`;

  const bodyObj =
    options.body && typeof options.body === "string"
      ? JSON.parse(options.body)
      : null;

  const cacheKey = makeCacheKey(method, url, bodyObj);
  const forceIgnoreCache = options.force_ignore_cache === true;
  const invalidateAfter = options.invalidate_after || [];

  log_verbose(">>> apiFetch", method, url);

  /* ===== CACHE READ ===== */
  if (!forceIgnoreCache && method === "GET") {
    const cached = readCache(cacheKey);
    if (cached !== null) {
      log_verbose("Cache HIT");
      return cached;
    }
  }

  /* ===== HEADERS ===== */
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  /* ===== FETCH ===== */
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    log_verbose("Response", response.status, data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    /* ===== CACHE SAVE ===== */
    if (!forceIgnoreCache && method === "GET") {
      saveCache(cacheKey, data);
    }

    /* ===== INVALIDATE ===== */
    if (invalidateAfter.length) {
      invalidateCache(invalidateAfter);
    }

    return data;
  } catch (err) {
    log_verbose("Fetch ERROR:", err);
    throw err;
  }
}
