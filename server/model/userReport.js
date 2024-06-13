const mongoose = require('../database/dbConnect')

const userReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userCollection'
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userCollection'
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const userReportCollection = new mongoose.model('userReportCollection',userReportSchema)

module.exports = userReportCollection