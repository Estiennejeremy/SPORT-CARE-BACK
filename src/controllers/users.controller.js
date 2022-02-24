const userModel = require("../models/users.model");
const bcrypt = require("bcryptjs");


var usersController = {
    index: function (req, res) {
        return userModel.find().exec();
    },
    show: function (req, res) {
        return userModel.findById(req.params.id).exec();
    },
    update: function (req, res) {
        return bcrypt.hash(req.body.password, 10).then(hash => {
            return userModel.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                age: req.body.age,
                address: req.body.address,
                birthdate: req.body.birthdate,
                civility: req.body.civility,
                role: req.body.role,
                condition: req.body.condition,
                coachId: req.body.coachId

            }, { new: true }).exec();
        })

    },
    delete: function (req, res) {
        return userModel.findByIdAndRemove(req.params.id).exec();
    },
    getCoachAthletes: function (req, res) {
        return userModel.find({
            "coachId": {
                "$eq": req.params.coachId
            }
        }).exec();
    }

}
module.exports = usersController;