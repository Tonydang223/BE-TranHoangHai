const express = require('express')
const authController = require('../controller/auth.controller')
const router = express.Router()
const authMid = require('../middleware/auth');

router.post('/signUp', authController.signUp);
router.post('/login', authController.login);

router
 .route('/resetPass/:uid/:token')
 .get(authController.resetPass)
 .post(authController.changePassword);

 router.post('/forgotPass', authController.forgotPass);

router.post('/logout', authMid.userGuard, authController.logout);
router.get("/refresh_token", authController.refreshToken);


module.exports = router;