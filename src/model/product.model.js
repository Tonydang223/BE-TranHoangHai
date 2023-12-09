const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    imgs: { type: Array, required: true },
    categories: { type: String, required: true },
    size: { type: String, required: true },
    code: { type: String, required: true},
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    count: { type: Number, required: true },
    sold: { type: Number, required: true },
    comment: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    isDeleted: { type: Boolean, default: false},
  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema)


module.exports = product;
