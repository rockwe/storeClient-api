const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const lignePanierSchema = mongoose.Schema({
    article: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Article' },
    panier: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Panier',default: null },
    price: { type: Number , required: true, default: 0},
    quantity: {type: Number , default: 0},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

lignePanierSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('LignePanier', lignePanierSchema);