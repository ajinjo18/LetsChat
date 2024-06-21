const router = require('express').Router()
const upload=require('../model/multer')

const authenticateToken = require('../middleware/authenticateToken')
// const isUserBlocked = require('../middleware/isUserBlocked')

const signupController = require('../controllers/signupController')
const loginController = require('../controllers/loginController')
const postController = require('../controllers/postController')
const userController = require('../controllers/userController')


router.post('/register', signupController.register  )
router.post('/otp', signupController.verifyRegisterOtp)
router.post('/resendOtp',signupController.resendOtp)

router.post('/login', loginController.login)
router.post('/google-login', loginController.googleLogin)

router.patch('/forget-password', userController.forgetPassword)
router.post('/forget-password-otp', userController.forgetPasswordOtp)
router.post('/forget-password-resend-otp', userController.forgetPasswordResendOtp)
router.patch('/new-password', userController.newPassword)


router.post('/add-post-description', authenticateToken, postController.addPostDescription);
router.post('/add-post', authenticateToken, upload.array('image'), postController.addPost);
router.get('/home-feeds', authenticateToken, postController.homeFeeds);
router.get('/get-post', authenticateToken, postController.getPostById)
router.delete('/delete-comment', authenticateToken, postController.deleteComment)
router.delete('/delete-reply', authenticateToken, postController.deleteReply)
router.get('/get-bookmarks', authenticateToken, postController.getBookMarks)
router.post('/add-category', authenticateToken, postController.addCategory)
router.post('/save-post', authenticateToken, postController.savePost)
router.post('/post-report', authenticateToken, postController.postReport)
router.post('/get-all-saved-posts', authenticateToken, postController.getAllSavedPosts)
router.get('/my-posts', authenticateToken, postController.myPosts)
router.post('/edit-category', authenticateToken, postController.editCategory)
router.delete('/delete-category', authenticateToken, postController.deleteCategory)
router.delete('/remove-saved-post', authenticateToken, postController.removePavedPost)
router.get('/get-user', authenticateToken, postController.userPostAndData)
router.delete('/delete-post', authenticateToken, postController.deletePost)
router.get('/single-post', authenticateToken, postController.singlePost)

router.patch('/update', authenticateToken, userController.update)
router.patch('/update-password', authenticateToken, userController.updatePassword)
router.get('/get-user-data', authenticateToken, userController.getUserData)
router.get('/get-user-details', authenticateToken, userController.getUserDetails)
router.get('/get-other-user-data', authenticateToken, userController.getOtherUserData)
router.get('/post-length', authenticateToken, userController.postLength)
router.post('/update-profile-image', authenticateToken, upload.single('image'), userController.updateProfileImage)
router.get('/all-following', authenticateToken, userController.allFollowing)
router.get('/suggest-friends', authenticateToken, userController.suggestFriends);
router.get('/users-search', authenticateToken, userController.userSearch )
router.get('/notifications', authenticateToken, userController.getNotifications)
router.get('/followers', authenticateToken, userController.followers)
router.get('/following', authenticateToken, userController.following)
router.put('/markAllAsRead', authenticateToken, userController.markAllAsRead)

router.get('/chat-user-search', authenticateToken, userController.chatUserSearch )

router.post('/mediaUpload',upload.single('file'), userController.mediaUpload)

module.exports = router