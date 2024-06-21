const express = require('express')
const router = express.Router()

const admin = require('../controllers/adminController')

router.post('/login', admin.login)
router.get('/all-users', admin.allUsers)
router.post('/block-user/:userId', admin.blockUser);
router.post('/unblock-user/:userId', admin.unblockUser);

router.get('/reported-post', admin.reportedPost)
router.put('/reject-report', admin.rejectReport)
router.delete('/delete-post', admin.deletePost)
router.get('/reported-user', admin.reportedUser)
router.put('/block-reported-user', admin.blockReportedUser)
router.put('/reject-report-user', admin.rejectReportUser)
router.get('/all-posts', admin.allPosts)
router.get('/monthly', admin.chart)

module.exports = router