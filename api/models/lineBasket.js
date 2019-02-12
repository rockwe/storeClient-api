const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const lineBasketSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    basket: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Basket',default: null },
    price: { type: Number , required: true, default: 0},
    quantity: {type: Number , default: 0},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

lineBasketSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('LineBasket', lineBasketSchema);