const { TYPE_COMMENT } = require("../config/constants");
const ProductM = require("../model/product.model");
const Course = require("../model/course.model");
const Commen = require("../model/comments.model");

class Comment {
  async createComment(req, res, next) {
    try {
      const { type } = req.body;

      switch (type) {
        case TYPE_COMMENT[0]:
          const product = await ProductM.findOne({ _id: req.body.product_id });
          if (!product)
            return res.status(400).json({ msg: "The product is not found !" });
          break;
        case TYPE_COMMENT[1]:
          const course = await Course.findOne({ _id: req.body.course_id });
          if (!course)
            return res.status(400).json({ msg: "The course is not found !" });
          break;
      }

      const newC = new Commen({ ...req.body, by_user: req.usr.id });

      const insertCommentToType = (type) => {
        const arr = [
          {
            type: TYPE_COMMENT[0],
            func: async (data) => {
              return await ProductM.findOneAndUpdate(
                { _id: req.body.product_id },
                { $push: { comment: data.condition } },
                { new: true }
              );
            },
          },
          {
            type: TYPE_COMMENT[1],
            func: async (data) => {
              return await Course.findOneAndUpdate(
                { _id: req.body.course_id },
                { $push: { comment: data.condition } },
                { new: true }
              );
            },
          },
        ];
        return arr.filter((l) => l.type === type);
      };

      insertCommentToType(newC.type)[0].func({ condition: newC._id });

      const data = await newC.save();

      return res
        .status(200)
        .send({ msg: "The comment is created successfully !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async getAllComments(req, res, next) {
    try {
      if (!TYPE_COMMENT.includes(req.params.type))
        return res.status(400).send({ msg: "The type is not right !" });
      const data = await Commen.find({ type: req.params.type })
        .sort("-commentedAt")
        .populate({
          path: "by_user",
          select: "-password",
        });
      return res
        .status(200)
        .send({ msg: "Get all comments successfully !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async editComment(req, res, next) {
    try {

      const data = await Commen.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body, editedAt: new Date() } },
        { new: true }
      );

      return res
        .status(200)
        .send({ msg: "The comment was edited successfully !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async delComment(req, res, next) {
    try {
        const data = await Commen.findByIdAndDelete(req.params.id);
        return res
        .status(200)
        .send({ msg: "The comment was deleted successfully !", data });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new Comment();
