const mongoose = require('mongoose');


const contactSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    message: { type: String, required: true},
    created_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Contact', contactSchema);