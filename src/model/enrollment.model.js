const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entrollSchame = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "users" },
    course: { type: Schema.Types.ObjectId, ref: "course" },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const enroll = mongoose.model("enrollment", entrollSchame);

module.exports = enroll;
