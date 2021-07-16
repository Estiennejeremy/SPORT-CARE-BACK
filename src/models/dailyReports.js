const mongoose = require ('mongoose');
//require('mongoose-double')(mongoose);
mongoose.set('debug', true);


const reportSchema = new mongoose.Schema ({
    UserId: {
        type: String,
        required: true,
        default: 0
    },
    Date: {
        type: Date,
        required: true,
        default: Date.now
    },
    DailyFeelings: {
        type: Number,
        min: 1,
        max: 5,
        required: false,
        default: 1
    },
    Size: {
        type: Number,
        required: false,
        default: null
    },
    Weight: {
        type: Number,
        required: false,
        default: null
    },
    Rmssd: {
        type: Number,
        required: false,
        default: null
    },
    Mhr: {
        type: Number,
        required: false,
        default: null
    },
    Bmi: {
        type: Number,
        required: false,
        default: null
    },
})


module.exports = mongoose.model('dailyReports', reportSchema);