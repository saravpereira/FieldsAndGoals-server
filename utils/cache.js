const CACHE_LIFETIME = 30 * 24 * 60 * 60 * 1000;
const cache = {};

const setCache = (key, data) => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
};

const getCache = (key) => {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < CACHE_LIFETIME) {
    return {
      data: entry.data,
      isCached: true,
    };
  }
  return null;
};

const clearCache = (key = null) => {
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach((k) => delete cache[k]);
  }
};

module.exports = {
  setCache,
  getCache,
  clearCache,
};
