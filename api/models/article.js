const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const articleSchema = mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: false },
    description: { type: String, default: 'Pas disponible.' },
    price: {
        amount: { type: Number, default: 0 },
        fixed: { type: Boolean, default: false }
    },
    currency: { type: String, default: 'DT' },
    original_language: { type: String, default: 'fr' },
    pictures: [{type: String}],
    region: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Town" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SubCategory' },
   // mark:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Mark'}, // marque du produit
    published: { type: Boolean, default: false },
    available: { type: Boolean, default: true }, // Sold or not
    live: { type: Boolean, default: true },
    exchange: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

articleSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Article', articleSchema);
