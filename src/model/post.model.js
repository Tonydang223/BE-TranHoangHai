const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchame = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    created_by: { type: String, default: 'tstranhoanghai.pmkt@gmail.com' },
    thumbnail: {type: Object, required: true },
    isDeleted: { type: Boolean, default: false},
  },
  { timestamps: true }
);

const post = mongoose.model("post", postSchame);

module.exports = post;
