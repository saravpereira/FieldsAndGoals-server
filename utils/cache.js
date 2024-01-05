const NodeCache = require('node-cache');
const CACHE_LIFETIME = 30 * 24 * 60 * 60;

const myCache = new NodeCache({
  stdTTL: CACHE_LIFETIME,
  checkperiod: CACHE_LIFETIME * 0.2,
});

const setCache = (key, data) => {
  myCache.set(key, data);
};

const getCache = (key) => {
  const data = myCache.get(key);
  if (data) {
    return {
      data,
      isCached: true,
    };
  }
  return null;
};

const clearCache = (key = null) => {
  if (key) {
    myCache.del(key);
  } else {
    myCache.flushAll();
  }
};

module.exports = {
  setCache,
  getCache,
  clearCache,
};
