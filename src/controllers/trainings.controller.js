const trainingModel = require("../models/trainings.model");

var trainingsController = {
  index: function (req, res) {
    return trainingModel.find().exec();
  },
  show: function (req, res) {
    return trainingModel.findById(req.params.id).exec();
  },
  create: function (req, res) {
    const training = new trainingModel({
      userId: req.body.userId,
      date: req.body.date,
      effort: req.body.effort,
      recap: req.body.recap,
      duration: req.body.duration,
      sportID: req.body.sportID,
    });
    return training.save();
  },
  update: function (req, res) {
    return trainingModel
      .findByIdAndUpdate(
        req.params.id,
        {
          userId: req.body.userId,
          date: req.body.date,
          effort: req.body.effort,
          recap: req.body.recap,
          duration: req.body.duration,
          sportID: req.body.sportID,
        },
        { new: true }
      )
      .exec();
  },
  delete: function (req, res) {
    return trainingModel.findByIdAndRemove(req.params.id).exec();
  },
  getUserTrainings: function (req, res) {
    return trainingModel
      .find({
        userId: {
          $eq: req.params.userId,
        },
      })
      .exec();
  },
  getUserLasTrainings: async function (req, res) {
    const test = await trainingModel
      .find({
        userId: {
          $eq: req.params.id,
        },
      })
      .sort({ date: -1 })
      .limit(1)
      .exec();
    console.log(test);
    return test
  },
};
module.exports = trainingsController;
