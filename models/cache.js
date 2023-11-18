const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema({
  key: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: Date,
});

const Cache = mongoose.model('Cache', cacheSchema);

module.exports = Cache;
