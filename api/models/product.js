const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: 'Pas disponible.' },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'DT' },
    original_language: { type: String, default: 'fr' },
    pictures: [{type: String}],
    region: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Town" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SubCategory' },
    mark:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Mark'}, // marque du produit
    published: { type: Boolean, default: false },
    available: { type: Boolean, default: true }, // Sold or not
    bar_code: { type: Number, required: true, default: 0 }, // code barre du produit
    number_serial: {type: Number, required: true, default: 0}, // numero de serie du produit
    live: { type: Boolean, default: true },
    amount: { type: Number, required: true, default: 1},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);
