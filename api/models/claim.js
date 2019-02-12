const mongoose = require('mongoose');

const claimSchema = mongoose.Schema({
    title: { type: String, required: true},
    description: { type:String, required: true, default: 'pas disponible' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Claim', claimSchema);