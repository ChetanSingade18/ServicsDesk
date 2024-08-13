import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    message: String,
    createdAt: { type: Date, default: Date.now() }
}, {
    collection: 'messages',
    versionKey: false
});

const messageModel = mongoose.model('messages', messageSchema);
export default messageModel;
