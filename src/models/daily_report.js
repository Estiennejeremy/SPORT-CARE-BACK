const mongoose = require ('mongoose');
//require('mongoose-double')(mongoose);
mongoose.set('debug', true);

var SchemaTypes = mongoose.Schema.Types;
const reportSchema = new mongoose.Schema ({
    Date: {
        type: Date,
        required: true,
        default: Date.now
    },
    Daily_feelings: {
        type: Number,
        min: 1,
        max: 5,
        required: false,
        default: 1
    },
    /*
    Rmssd: {
        type: SchemaTypes.Double,
        required: false,
        default: null
    },
    Mhr: {
        type: Number,
        required: false,
        default: null
    },
    Weight: {
        type: SchemaTypes.Double,
        required: false,
        default: null
    },
    Bmi: {
        type: SchemaTypes.Double,
        required: false,
        default: null
    },
    Size: {
        type: SchemaTypes.Double,
        required: false,
        default: null
    },*/
})


module.exports = mongoose.model('Daily_report', reportSchema);