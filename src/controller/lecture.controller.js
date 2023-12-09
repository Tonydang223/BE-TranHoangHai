const LectureM = require("../model/lecture.model");
const CourseM = require("../model/course.model");
const UserM = require("../model/user.model");
const { ROLES } = require("../config/constants");

class Lecture {
  async actionsLectures(req, res, next) {
    try {
      const findCourse = await CourseM.findOne({ _id: req.params.id });
      if (!findCourse) {
        return res
          .status(400)
          .json({ msg: "The course is not existed available!" });
      }

      const updateLecturesOfCourse = req.body.items.map(async (doc) => {
        const { _id, isDel, ...updateData } = doc;
        if (_id) {
          if (!isDel) {
            const updatedDocument = await LectureM.findOneAndUpdate(
              { _id },
              {
                $set: { ...updateData },
              },
              { new: true }
            );
            if (!updateData) {
              return res
                .status(400)
                .json({ msg: "The ids may be not right in lectures!" });
            }
            return updatedDocument;
          } else {
            const deleteDocument = await LectureM.deleteOne({ _id });

            if (deleteDocument.deletedCount < 1) {
              return res
                .status(400)
                .json({ msg: "The ids may be not right in lectures!" });
            }
            return deleteDocument;
          }
        } else {
          const lectureExisted = await LectureM.findOne({ title: doc.title });

          if(lectureExisted) {
            return res
            .status(400)
            .json({ msg: "Having a lecture in letures may be existed!" });
          }

          const createDocument = await LectureM.create({ ...updateData })
          return createDocument;
        }
      });

      const data = await Promise.all(updateLecturesOfCourse);

      res
        .status(200)
        .json({ mgs: "The lectures has been updated successfully!", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async editLecture(req, res, next) {
    try {
      const data = await LectureM.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true }
      );
      res
        .status(200)
        .json({ mgs: "The lecture has been updated successfully !", data });
    } catch (error) {
      return res.status(500).send({ msg: error._message });
    }
  }
  async delLecture(req, res, next) {
    try {
      const data = await LectureM.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ mgs: "The lecture has been deleted successfully !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async getAllLectureOfACourseUnSign(req, res, next) {
    try {
      let data = await LectureM.find({ course: req.params.id });

      if (!data)
        return res.status(404).json({ msg: "The course has not been found!" });

      res
        .status(200)
        .json({ mgs: "The lectures has been gotten successfully !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async getAllLectureOfACourseSigned(req, res, next) {
    try {
      const course = await CourseM.findOne({ _id: req.params.id });
      const user = await UserM.findOne({ _id: req.usr.id });

      if (
        course.students.includes(req.usr.id) ||
        user.role == ROLES[1] ||
        !course
      ) {
        const data = await LectureM.find({ course: req.params.id });
        return res
          .status(200)
          .json({ msg: "Get all lectures successfully!", data });
      } else {
        return res
          .status(403)
          .json({
            msg: "You do not have permission to access these lectures or the course is not existed !",
          });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new Lecture();
