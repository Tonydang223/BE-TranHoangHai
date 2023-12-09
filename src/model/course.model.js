const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchame = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    instructor_by: { type: String, required: true },
    comment: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    amount_time: { type: String, required: true },
    thumbnail: {type: Object, required: true },
    level: {type: String, required: true},
    students: [{ type: mongoose.Types.ObjectId, ref: "users" }],
    isDeleted: { type: Boolean, default: false},
  },
  { timestamps: true }
);

const course = mongoose.model("course", courseSchame);

module.exports = course;
