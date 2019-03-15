const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: null },
    picture: { type: String, default: 'res://ic_default_avatar' },
    isProfessional: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    active: { type: Boolean, default: true },
    pushCategories: [{type: String}],
    notifyOnProductVisite: { type: Boolean, default: true },
    live: { type: Boolean, default: true },
    device: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Device' },
    reset_token: { type: String, default: null },
    resetPasswordExpires: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);