const mongoose = require ('mongoose');
mongoose.set('debug', true);


const sportSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        default: null
    },
})


module.exports = mongoose.model('sports', sportSchema);