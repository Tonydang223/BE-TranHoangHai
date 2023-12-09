const express = require("express");
const enrollController = require("../controller/enrollment.controll");
const router = express.Router();
const authMid = require('../middleware/auth');
const verifyRole = require("../middleware/authRole");
const { ROLES } = require("../config/constants");


router.post('/:idUser/:idCourse', authMid.userGuard, verifyRole(ROLES[1]), enrollController.assign);
router.post('/del', authMid.userGuard, verifyRole(ROLES[1]), enrollController.deleteEnrollM);
router.get('/parts', authMid.userGuard, verifyRole(ROLES[1]), enrollController.getEnrolls);


module.exports = router;
