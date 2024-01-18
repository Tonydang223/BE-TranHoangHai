const express = require("express");
const courseController = require("../controller/course.controller");
const router = express.Router();
const authMid = require("../middleware/auth");
const verifyRole = require("../middleware/authRole");
const { ROLES } = require("../config/constants");

router
  .route("/parts")
  .post(authMid.userGuard, verifyRole(ROLES[1]), courseController.createCourse)
  .get(courseController.getAllCourses)

router.get('/parts/:id', courseController.getOneCourse);
router.post(
  "/:id",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  courseController.editCourse
);

router.post(
    "/del/selections",
    authMid.userGuard,
    verifyRole(ROLES[1]),
    courseController.deleteCourse
  );
  router.post(
    "/del/restore",
    authMid.userGuard,
    verifyRole(ROLES[1]),
    courseController.deleteCourseRestore
  );
  router.post(
    "/del/restore/back",
    authMid.userGuard,
    verifyRole(ROLES[1]),
    courseController.deleteCourseRestoreBack
  );

router.get('/mine', authMid.userGuard, courseController.getMyCourse);
router.post('/confirm/:id', authMid.userGuard, courseController.confirmCodeCourse);

module.exports = router;
