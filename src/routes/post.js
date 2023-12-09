const express = require("express");
const postController = require("../controller/post.controller");
const router = express.Router();
const authMid = require("../middleware/auth");
const verifyRole = require("../middleware/authRole");
const { ROLES } = require("../config/constants");

router.get("/parts", postController.getAllPosts);
router.get("/parts/:id", postController.getOnePost);
router.post(
  "/edit/:id",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  postController.editProduct
);
router.post(
  "/create",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  postController.createPost
);
router.post(
  "/del/selections",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  postController.deletePost
);
router.post(
  "/del/restore",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  postController.deletePostRestore
);
router.post(
  "/del/restore/back",
  authMid.userGuard,
  verifyRole(ROLES[1]),
  postController.deletePostRestoreBack
);

module.exports = router;

