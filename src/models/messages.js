const mongoose = require ('mongoose');
//require('mongoose-double')(mongoose);
mongoose.set('debug', true);


const messageSchema = new mongoose.Schema ({
    userId: {
        type: String,
        required: true,
        default: 0
    },
    userIdRecever: {
        type: String,
        required: true,
        default: 0
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
})


module.exports = mongoose.model('messages', messageSchema);