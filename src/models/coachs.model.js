const mongoose = require ('mongoose');
mongoose.set('debug', true);


const coachSchema = new mongoose.Schema ({
    userId: {
        type: String,
        required: true,
        default: null
    },
    description: {
        type: String,
        required: false,
        default: null
    },
})


module.exports = mongoose.model('coachs', coachSchema);