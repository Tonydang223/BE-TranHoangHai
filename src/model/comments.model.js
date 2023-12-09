const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {TYPE_COMMENT} = require('../config/constants');

const commentSchame = new Schema({
    message: { type: String, required: true},
    commentedAt: { type: Date, default: new Date()},
    by_user: { type: mongoose.Types.ObjectId, ref: 'users', required: true},
    type: { type: String, required: true, enum: TYPE_COMMENT},
    product_id: { type: mongoose.Types.ObjectId, ref: 'product'},
    course_id: { type: mongoose.Types.ObjectId, ref: 'course'},
    editedAt: { type: Date, default: null},
    likes:[{type: mongoose.Types.ObjectId, ref: 'users'}],
    reply: mongoose.Types.ObjectId,
})

const comment = mongoose.model('comment', commentSchame);

module.exports = comment;