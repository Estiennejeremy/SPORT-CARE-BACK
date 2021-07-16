const mongoose = require ('mongoose');
//require('mongoose-double')(mongoose);
mongoose.set('debug', true);


const trainingSchema = new mongoose.Schema ({
    userId: {
        type: String,
        required: true,
        default: 0
    },
    sportID: {
        type: String,
        required: true,
        default: 0
    },
    Date: {
        type: Date,
        required: true,
        default: Date.now
    },
    Effort: {
        type: Number,
        min: 1,
        max: 5,
        required: false,
        default: 1
    },
    Recap: {
        type: String,
        required: false,
        default: null
    },
    Duration: {
        type: Number,
        required: true,
        default: 0
    },
})


module.exports = mongoose.model('trainings', trainingSchema);