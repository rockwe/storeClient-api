const mongoose = require('mongoose');


const contactSchema = mongoose.Schema({
    email: { type: String, required: false },
    title: { type: String, required: false, default: "Renseignements"},
    message: { type: String, required: true},
    created_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Contact', contactSchema);