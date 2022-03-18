const mongoose = require ('mongoose');
mongoose.set('debug', true);


const messageSchema = new mongoose.Schema ({
    conversationId: {
        type: String,
        required: true,
        default: null
    },
    userId: {
        type: String,
        required: true,
        default: null
    },
    message: {
        type: String,
        required: true,
        default: null
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
});



module.exports = mongoose.model('messages', messageSchema);