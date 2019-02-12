const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);