const reportModel = require("../models/dailyReports.model");

var dailyReportsController = {
    index: function (req, res) {
        return reportModel.find().populate('cardiacRecordId').exec();
    },
    show: function (req, res) {
        return reportModel.findById(req.params.id).populate('dailyRecords').populate('cardiacRecordId').exec();
    },
    create: function (req, res) {
        const report = new reportModel({
            userId: req.body.userId,
            cardiacRecordId: req.body.cardiacRecordId,
            dailyFeelings: req.body.dailyFeelings,
            size: req.body.size,
            date: Date.now(),
            weight: req.body.weight,
            rmssd: req.body.rmssd,
            mhr: req.body.mhr,
            bmi: req.body.bmi,
        });
        return report.save();
    },
    update: function (req, res) {
        return reportModel.findByIdAndUpdate(req.params.id, {
            cardiacRecordId: req.body.cardiacRecordId,
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
        }).populate('dailyRecords').exec();



    },
    getUserReports: function (req, res) {
        return reportModel.find({
            "userId": {
                "$eq": req.params.userId
            }
        }).populate('cardiacRecordId').exec();
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
        }).populate('cardiacRecordId').exec();
        if (reports.length > 0) {

            return reports.sort((a, b) => a.date - b.date);
        }
        return null
    },
    getUserLastReport: async function (req, res) {
        reports = await reportModel.find({ userId: req.params.userId }).populate('cardiacRecordId').exec();
        if (reports.length > 0) {
            return reports[reports.length - 1];
        }
    }
}
module.exports = dailyReportsController;