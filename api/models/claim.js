const mongoose = require('mongoose');

const claimSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required:true, ref: 'User' },
    title: { type: String, required: true},
    description: { type:String, required: true, default: 'pas disponible' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Claim', claimSchema);