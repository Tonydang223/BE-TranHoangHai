const mongoose = require('mongoose')
const { TYPE_COMMENT } = require('../config/constants')
const Schema = mongoose.Schema

const categoriesSchema = new Schema({
    content: {type: String, unique: true, required: true},
    type: {type: String, required: true, enum: TYPE_COMMENT}
},
{ timestamps: true }
)

const categories = mongoose.model('categories', categoriesSchema);

module.exports = categories;