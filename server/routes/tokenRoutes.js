const express = require("express");
const router = express.Router();

const token = require('../controllers/tokenController')

router.post("/refresh", token.refreshToken);

module.exports = router
