const express = require('express')
const router = express.Router()
const userController = require('../controller/user.controller');
const authMid = require('../middleware/auth');
const verifyRole = require('../middleware/authRole')
const { ROLES } = require('../config/constants')
const upload = require('../config/multer')

router.get('/getInfo', authMid.userGuard ,userController.getInfoUsr);

router.get('/getAll', authMid.userGuard, verifyRole(ROLES[1]), userController.getAllUsers);
router.post('/editProfile', authMid.userGuard ,userController.editInfo);
router.post('/updatePass', authMid.userGuard ,userController.updatePass);
router.post('/uploadImg', authMid.userGuard, upload.single('avatar'), userController.uploadImgProfile);
router.post('/block/:id', authMid.userGuard, verifyRole(ROLES[1]), userController.blockUsr);
router.post('/unblock/:id', authMid.userGuard, verifyRole(ROLES[1]), userController.unBlockUsr);
router.post('/create', authMid.userGuard, verifyRole(ROLES[1]), userController.createUser);
router.post('/changePass/:id', authMid.userGuard, verifyRole(ROLES[1]), userController.changePassAdmin);





module.exports = router;