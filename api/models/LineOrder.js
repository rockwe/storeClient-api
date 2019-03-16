const mongoose = require('mongoose');

const lineOrderSchema = mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
    quantity: { type: Number, default: 0},
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'},
    prixUntaire: { type: Number, default: 0},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LineOrder', lineOrderSchema);