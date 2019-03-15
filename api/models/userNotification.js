const mongoose = require('mongoose');


const userNotificationSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User' },
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product' },
    date: { type: Date, default:  Date.now() },
    notif_user: { type: Boolean, default: false},
    verif_notif_user: { type: Boolean, default: false}

})

module.exports = mongoose.model('UserNotif', userNotificationSchema);