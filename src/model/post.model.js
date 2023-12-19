const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchame = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    created_by: { type: String, default: 'tstranhoanghai.pmkt@gmail.com' },
    thumbnail: {type: Object, required: true },
    isDeleted: { type: Boolean, default: false},
    categories: { type: String, required: true },
    short_des: { type: String, required: true },
  },
  { timestamps: true }
);

const post = mongoose.model("post", postSchame);

module.exports = post;
