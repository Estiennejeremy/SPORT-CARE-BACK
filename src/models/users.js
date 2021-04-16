const mongoose = require ('mongoose')
mongoose.set('debug', true);


const userSchema = new mongoose.Schema ({
    Last_name: {
        type: String,
        require
    },
    First_name: {
        type: String,
        require
    },
    Birthdate: {
        type: Date,
        required: true
    },
    Adress: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        required: true
    },
    UserDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    Civility: {
        type: Boolean,
        required: true
    },
    Mail: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }

})


module.exports = mongoose.model('Users', userSchema);