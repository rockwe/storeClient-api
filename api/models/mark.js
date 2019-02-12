const mongoose = require('mongoose');

const markSchema = mongoose.Schema({
    name: { type: String, required: true },
    live: { type: Boolean, default: true },
});

module.exports = mongoose.model('Mark', markSchema);