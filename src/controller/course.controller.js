const { uploads } = require("../config/cloudinary");
const { TYPE_COMMENT } = require("../config/constants")
const CommentM = require("../model/comments.model");
const LectureM = require("../model/lecture.model")
const CourseM = require("../model/course.model");
const fs = require("fs");

class Course {
  async createCourse(req, res, next) {
    try {
      const course = await CourseM.findOne({ name: req.body.name });
      if (course)
        return res
          .status(400)
          .json({ msg: "The course is already available!" });

      let newCourse = await CourseM({
        ...req.body,
      });

      const data = await newCourse.save();

      res
        .status(200)
        .json({ msg: "The course was successfully created!", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async editCourse(req, res, next) {
    try {
      const data = await CourseM.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: { ...req.body }
        },
        {new: true}
      );
      if(!data) return res.status(404).json({ msg: 'The course was not found!'});
      res
        .status(200)
        .json({ msg: "The course has been updated successfully!", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async getMyCourse(req, res, next) {
     try {
        const data = await CourseM.find({students: {$in: [req.usr.id]}});
        return res.status(200).json({msg: 'Get your course successfully !', data});
        
     } catch (error) {
        return res.status(500).json({ msg: error.message });
     }
  }
  async getAllCourses(req, res, next) {
    try {
       const data = await CourseM.find().sort('-createdAt');
       res.status(200).json({ msg: 'Get all courses successfully!', data });
    } catch (error) {
       return res.status(500).json({ msg: error.message });
    }
 }
  async getOneCourse(req, res, next) {
    try {
      const data = await CourseM.findOne({_id: req.params.id}).populate({
        path: "comment",
        populate: {
          path: "by_user likes",
          select: "-password",
        },
        options: { sort: { commentedAt: -1 } },
      });;
    if(!data) return res.status(404).json({ msg: 'The course not found !'})
    res.status(200).json({ msg: 'Get one course successfully!', data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async deleteCourseRestore(req, res, next) {
    try {

      const dataDel = await CourseM.updateMany(
        {_id: {$in: req.body.ids}},
        {
          $set: {isDeleted: true}
        },
        {multi: true}
      )
      if(dataDel.modifiedCount < 1) {
        return res.status(400).json({msg: 'The id is not existed or delete failed !'});
      }
      res.status(200).json({msg: 'The courses were deleted temporarily !'})
      
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async deleteCourseRestoreBack(req, res, next) {
    try {

      const dataDel = await CourseM.updateMany(
        {_id: {$in: req.body.ids}},
        {
          $set: {isDeleted: false}
        },
        {multi: true}
      )
      if(dataDel.modifiedCount < 1) {
        return res.status(400).json({msg: 'The id is not existed or delete failed !'});
      }
      res.status(200).json({msg: 'The courses were deleted temporarily !'})
      
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async deleteCourse(req, res, next) {
    try {

        const dataDel = await CourseM.deleteMany(
          { _id: {$in: req.body.ids} },
        );

      await LectureM.deleteMany({course: {$in: req.body.ids}});
      await CommentM.deleteMany({$and: [{type: TYPE_COMMENT[1]}, {course_id: {$in: req.body.ids}}]});
  
        if(dataDel.deletedCount < 1) {
          return res.status(400).json({msg: 'The id is not existed or delete failed !'});
        }
        return res.status(200).json({ msg: "The course was deleted !" });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new Course();
