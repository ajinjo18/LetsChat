const mongoose = require('../database/dbConnect')

const tempRegisterSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    otp: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const tempRegisterCollection = new mongoose.model('tempRegister',tempRegisterSchema)

module.exports = tempRegisterCollection