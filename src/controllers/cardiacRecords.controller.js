const cardiacModel = require("../models/cardiacRecords.model");
const reportModel = require("../models/dailyReports.model");
const IaClient = require("../services/ia-client");

var cardiacRecordsController = {
    index: async function (req, res) {
        return cardiacModel.find().populate('dailyReportId').exec();
    },
    show: async function (req, res) {
        return cardiacModel.findById(req.params.id).exec();
    },
    delete: async function (req, res) {
        return cardiacModel.findByIdAndRemove(req.params.id).exec();
    },
    create: async function (req, res) {
        const allRm = []
        let status = null;
        const allModels = reportModel.find();
        const fiveLastRmssd = (await allModels).filter(model => model.rmssd).slice(Math.max(allModels.length - 5, 0))
        console.log(fiveLastRmssd)
        rmssd = await IaClient.getRmssd(req.body.hrData);
        if (fiveLastRmssd.length >= 4) {

            for (const item of fiveLastRmssd) {
                allRm.push(item.rmssd);
            }
            allRm.push(rmssd)
            status = await IaClient.getState(allRm)
        }
        const average = req.body.hrData.reduce((a, b) => a + b) / req.body.hrData.length;
        const cardiacRecord = new cardiacModel({
            dailyReportId: req.body.dailyReportId,
            rmssd: rmssd,
            heartRate: average,
            hrData: req.body.hrData,
            currentStatus: status
        });
        return cardiacRecord.save();
    },
    update: async function (req, res) {
        return cardiacModel.findByIdAndUpdate(req.params.id, {
            dailyReportId: req.body.dailyReportId,
            rmssd: req.body.rmssd,
            heartRate: req.body.heartRate,
            hrData: req.body.hrData,
            currentStatus: req.body.status
        }, { new: true }).exec();
    },
    getReportCardiacRecords: async function (req, res, next) {
        return cardiacModel.find({
            userId: req.params.dailyReportId,
        });
    }
};

module.exports = cardiacRecordsController;