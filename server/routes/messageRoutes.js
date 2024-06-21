const express = require('express')
const router = express.Router()

const message = require('../controllers/messageController')

//add
router.post("/", message.addMessage);

//get
router.get("/:conversationId", message.getMessage);

module.exports = router;