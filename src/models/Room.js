
const mongoose = require('mongoose');

const User = require('./User');

const MessageSchema = {
    text: { type: String, required: true },
    authorId: String,
    authorName: String,
    createdAt: { type: Date, default: Date.now() }
};

const MemberSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, required: true },
    key: { type: String, required: true }
});

const roomSchema = new mongoose.Schema({
    title: { type: String, required: false },
    creator: { type: String, required: true },
    members: [MemberSchema],
    messages: [MessageSchema],
    description: String,
    diagram: String,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
