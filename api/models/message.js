const mongoose = require('mongoose');

const messageTypes = { TEXT: 'text', IMAGE: 'image', FILE: 'file' };
const messageStatus = { SENDING: 'sending', RECEIVED: 'received', READ: 'read' };

const messageSchema = mongoose.Schema({
    content: { type: String, required: true },
    type: { type: String, required: true, default: messageTypes.TEXT },
    status: { type: String, required: true, default: messageStatus.RECEIVED },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    trigger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deleted_by_1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, default: null },
    deleted_by_2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, default: null },
    live: { type: Boolean, default: true },
    sent_at: { type: Date, default: Date.now },
    read_at: { type: Date, default: null }
});

module.exports = mongoose.model('Message', messageSchema);
