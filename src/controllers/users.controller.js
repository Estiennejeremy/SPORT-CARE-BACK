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
    patch: async function (req, res) {
        if (req.body.firstName != null) {
            res.user.firstName = req.body.firstName;
        }
        if (req.body.lastName != null) {
            res.user.lastName = req.body.lastName;
        }
        if (req.body.email != null) {
            res.user.email = req.body.email;
        }
        if (req.body.birthdate != null) {
            res.user.birthdate = req.body.birthdate;
        }
        if (req.body.address != null) {
            res.user.address = req.body.address;
        }
        if (req.body.role != null) {
            res.user.role = req.body.role;
        }
        if (req.body.civility != null) {
            res.user.civility = req.body.civility;
        }
        if (req.body.password != null) {
            res.user.password = req.body.password;
        }
        if (req.body.condition != null) {
            res.user.condition = req.body.condition;
        }
        if (req.body.coachId != null) {
            res.user.coachId = req.body.coachId;
        }

        try {
            const updatedUser = await res.user.save();
           return updatedUser
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
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