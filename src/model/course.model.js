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
    short_des: { type: String, required: true },
    code: {type: String, required: true},
    confirmer: [{ type: mongoose.Types.ObjectId, ref: "users"}]
  },
  { timestamps: true }
);

const course = mongoose.model("course", courseSchame);

module.exports = course;
