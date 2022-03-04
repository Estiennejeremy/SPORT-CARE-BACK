const sportModel = require("../models/sports.model");

var sportController = {
    index: function (req, res) {
        return sportModel.find().exec();
    },
    show: function (req, res) {
        return sportModel.findById(req.params.id).exec();
    },
    create: function (req, res) {
        const sport = new sportModel({
            name: req.body.name
        });
        return sport.save();
    },
    delete: function (req, res) {
        return sportModel.findByIdAndRemove(req.params.id).exec();
    },
    update: function (req, res) {
        return sportModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name
        }, { new: true }).exec();
    }
}

module.exports = sportController;