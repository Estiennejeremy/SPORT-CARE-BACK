const reportModel = require("../models/dailyReports.model");

var dailyReportsController = {
    index: function (req, res) {
        return reportModel.find().exec();
    },
    show: function (req, res) {
        return reportModel.findById(req.params.id).exec();
    },
    create: function (req, res) {
        const report = new reportModel({
            userId: req.body.userId,
            dailyFeelings: req.body.dailyFeelings,
            size: req.body.size,
            weight: req.body.weight,
            rmssd: req.body.rmssd,
            mhr: req.body.mhr,
            bmi: req.body.bmi,
        });
        return report.save();
    },
    update: function (req, res) {
        return reportModel.findByIdAndUpdate(req.params.id, {
            userId: req.body.userId,
            dailyFeelings: req.body.dailyFeelings,
            size: req.body.size,
            weight: req.body.weight,
            rmssd: req.body.rmssd,
            mhr: req.body.mhr,
            bmi: req.body.bmi,
        }, { new: true }).exec();
    },
    delete: function (req, res) {
        return reportModel.findByIdAndRemove(req.params.id).exec();
    },
    getReportWithDate: function (req, res) {
        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);

        return reportModel.find({
            "userId": {
                "$eq": req.params.userId
            },
            "date": {
                "$gt": d
            }
        }).exec();
    },
    getUserReports: function (req, res) {
        return reportModel.find({
            "userId": {
                "$eq": req.params.userId
            }
        }).exec();
    },
    getReportLast5Days: async function (req, res) {
        let reports


        var dmin = new Date();
        dmin.setDate(dmin.getDate() - 6);
        dmin.setHours(0);
        dmin.setMinutes(0);
        dmin.setSeconds(0);

        var dmax = new Date().setDate(dmin.getDate() + 5);

        reports = await reportModel.find({
            "userId": {
                "$eq": req.params.userId
            },
            "date": {
                "$gt": dmin,
                "$lt": dmax
            }
        })
        return reports.sort((a, b) => a.date - b.date);

    },
    getUserLastReport: async function (req, res) {
        reports = await reportModel.find({ userId: req.params.userId });
        if (reports.length > 0) {
            return reports[reports.length - 1];
        }
    }
}
module.exports = dailyReportsController;