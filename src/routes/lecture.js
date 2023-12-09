const express = require("express");
const lectureController = require("../controller/lecture.controller");
const router = express.Router();
const authMid = require("../middleware/auth");
const verifyRole = require("../middleware/authRole");
const { ROLES } = require("../config/constants");

router
  .route("/parts/:id")
  .post(
    authMid.userGuard,
    verifyRole(ROLES[1]),
    lectureController.actionsLectures
  )
  .get(lectureController.getAllLectureOfACourseUnSign);

router.get("/signed/:id", authMid.userGuard, lectureController.getAllLectureOfACourseSigned);
router.post(
  "/edit/:id",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  lectureController.editLecture
);
router.post(
  "/delete/:id",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  lectureController.delLecture
);

module.exports = router;
