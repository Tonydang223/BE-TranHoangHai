const Usrm = require("../model/user.model");
const CourseM = require("../model/course.model");
const EnrollM = require("../model/enrollment.model");

class Entroll {
  async assign(req, res, next) {
    try {
      const user = await Usrm.findOne({ _id: req.params.idUser });
      if (!user)
        return res.status(400).json({ msg: "The user does not exist!" });

      const course = await CourseM.findOne({ _id: req.params.idCourse });
      if (!course || course.students.includes(req.params.idUser))
        return res.status(400).json({ msg: "The course does not exist or student has been assigned to this course !" });

      const newAccepted = new EnrollM({
        student: req.params.idUser,
        course: req.params.idCourse,
      });

      await CourseM.findByIdAndUpdate(
        { _id: course._id },
        { $push: { students: req.params.idUser } },
        { new: true }
      );

      const data = await newAccepted.save();

      res.status(200).json({ msg: "The user assigned to course !", data });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async deleteEnrollM(req, res, next) {
    try {
        const data = await EnrollM.deleteMany({_id: {$in : req.body.ids}});


        if(data.deletedCount < 1) {
            return res.status(400).json({msg: 'The id is not existed or delete failed !'});
        }

        return res.status(200).json({msg: 'The enrollment was deleted successfully !'});

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }
  async getEnrolls(req, res, next) {
    try {
        const data = await EnrollM.find().sort('-createdAt');
        return res.status(200).json({msg: 'The enrollments was gotten successfully !', data});
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new Entroll();
