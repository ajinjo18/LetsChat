const mongoose = require('../database/dbConnect')

const userSchema = new mongoose.Schema({
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
    phone: {
        type: Number
    },
    dob: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: 'profile.png'
    },
    isBlocked: {
        type: Boolean,
        default: false 
    },
    isOnline: {
        type: String
    },
    createdAt: {
        type: Date
    },
    otp: {
        type: Number
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userCollection'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userCollection'
        }
    ],
    notifications: [{
        type: {
          type: String,
          enum: ['like', 'comment', 'follow', 'reply'],
          required: true
        },
        firstName: String,
        lastName: String,
        profilePicture: String,
        userId: String,
        postId: String,
        commentId: String,
        images: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        isRead: String
    }],
    // savedPost: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'postCollection'
    // }]
})

const userCollection = new mongoose.model('userCollection',userSchema)

module.exports = userCollection