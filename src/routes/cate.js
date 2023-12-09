const express = require("express");
const cateController = require("../controller/categories.controller");
const router = express.Router();
const authMid = require('../middleware/auth');
const verifyRole = require('../middleware/authRole')
const { ROLES } = require('../config/constants')


router
  .route("/parts")
  .get(authMid.userGuard, cateController.getAllCategory)
  .post(authMid.userGuard, verifyRole(ROLES[1]), cateController.createCategory);


router.post('/update/:id', authMid.userGuard, verifyRole(ROLES[1]) ,  cateController.editCategory);

module.exports = router;
