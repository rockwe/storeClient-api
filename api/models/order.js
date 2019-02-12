const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    line_basket: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'LineBasket'},
    isvalid: { type: Boolean, required: true, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Order', orderSchema);