const Cache = require('../models/cache');
const CACHE_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 days

const setCache = async (key, data) => {
  const timestamp = new Date();
  await Cache.findOneAndUpdate(
    { key },
    { data, timestamp },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const getCache = async (key) => {
  const cacheEntry = await Cache.findOne({ key });
  if (cacheEntry && new Date() - cacheEntry.timestamp < CACHE_LIFETIME) {
    return {
      data: cacheEntry.data,
      isCached: true,
    };
  }
  return null;
};

const clearCache = async (key = null) => {
  if (key) {
    await Cache.deleteOne({ key });
  } else {
    await Cache.deleteMany({});
  }
};

module.exports = {
  setCache,
  getCache,
  clearCache,
};
