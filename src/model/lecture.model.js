const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lectureSchame = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videoIntro: {
      type: Object,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: "course" },
  },
  { timestamps: true }
);

const lecture = mongoose.model("lectures", lectureSchame);

module.exports = lecture;
