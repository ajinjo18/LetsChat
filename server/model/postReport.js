const mongoose = require('../database/dbConnect')

const postReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userCollection'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postCollection'
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

const postReportCollection = new mongoose.model('postReportCollection',postReportSchema)

module.exports = postReportCollection