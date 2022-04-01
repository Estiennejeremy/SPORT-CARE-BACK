const coachModel = require("../models/coachs.model");


var coachController = {
    index: function (req, res) {
        if (req.query.userId) {
            return coachModel.find({
                userId: {
                    $eq: req.query.userId,
                },
            }).exec();
        }
        return coachModel.find().exec();

    },
    show: function (req, res) {
        return coachModel.findById(req.params.id).exec();
    },
    create: function (req, res) {
        const coach = new coachModel({
            userId: req.body.userId,
            description: req.body.description,
        });
        return coach.save();
    },
    update: function (req, res) {
        return coachModel.findByIdAndUpdate(req.params.id, {
            userId: req.body.userId,
            description: req.body.description,
        }, { new: true }).exec();
    },
    delete: function (req, res) {
        return coachModel.findByIdAndRemove(req.params.id).exec();
    }

}
module.exports = coachController;