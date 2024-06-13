const express = require("express");
const router = express.Router();

const conversation = require('../controllers/conversationController')

//new conv
router.post("/", conversation.newConv);

//get conv of a user
router.get("/:userId", conversation.convOfAUser);

// get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", conversation.convIncludesTwoUserId);

router.post('/markallasread', conversation.markMessagesAsRead)

module.exports = router;
