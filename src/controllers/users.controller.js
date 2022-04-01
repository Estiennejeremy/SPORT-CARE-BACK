const userModel = require("../models/users.model");
const bcrypt = require("bcryptjs");


var usersController = {
    index: function (req, res) {
        //find all user by coach id 
        if (req.query.userId) {
            return userModel.find({
                coachId: {
                    $eq: req.query.userId,
                },
            }).exec();
        }
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
        user = await userModel.findById(req.params.id);

        if (req.body.firstName != null) {
            user.firstName = req.body.firstName;
        }
        if (req.body.lastName != null) {
            user.lastName = req.body.lastName;
        }
        if (req.body.email != null) {
            user.email = req.body.email;
        }
        if (req.body.birthdate != null) {
            user.birthdate = req.body.birthdate;
        }
        if (req.body.address != null) {
            user.address = req.body.address;
        }
        if (req.body.role != null) {
            user.role = req.body.role;
        }
        if (req.body.civility != null) {
            user.civility = req.body.civility;
        }
        if (req.body.password != null) {
            user.password = req.body.password;
        }
        if (req.body.condition != null) {
            user.condition = req.body.condition;
        }
        if (req.body.coachId != null) {
            user.coachId = req.body.coachId;
        }

        try {
            return await user.save();

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