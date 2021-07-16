const mongoose = require ('mongoose');
mongoose.set('debug', true);


const userSchema = new mongoose.Schema ({
    Last_name: {
        type: String,
        require : true
    },
    First_name: {
        type: String,
        require: true
    },
    Birthdate: {
        type: Date,
        required: false
    },
    Adress: {
        type: String,
        required: false
    },
    Role: {
        type: Boolean,
        required: true,
        default: false
    },
    UserDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    Civility: {
        type: Number,
        min: 0,
        max: 1,
        required: false,
        default: 0
    },
    Email: {
        type: String,
        required: true,
        unique: true 
    },
    Password: {
        type: String,
        required: true
    },
    CoachId: {
        type: String,
        required: false
    }
})


module.exports = mongoose.model('Users', userSchema);