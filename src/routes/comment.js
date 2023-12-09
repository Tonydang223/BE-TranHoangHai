const express = require("express");
const commentController = require("../controller/comment.controller");
const router = express.Router();
const authMid = require('../middleware/auth');


router.post('/add', authMid.userGuard, commentController.createComment);
router.get('/parts/:type', commentController.getAllComments);
router.post('/:id', authMid.userGuard, commentController.editComment);
router.post('/del/:id', authMid.userGuard, commentController.delComment);

module.exports = router;
