

const authRoutes = require('./auth');
const ursRoutes = require('./usr');
const cate = require('./cate');
const product = require('./product');
const comment = require('./comment');
const course = require('./course');
const lecture = require('./lecture');
const enroll = require('./enroll');
const post = require('./post');
function routes(app) {
    app.use('/api/auth',authRoutes);
    app.use('/api/user',ursRoutes);
    app.use('/api/categories', cate);
    app.use('/api/products', product);
    app.use('/api/comment', comment);
    app.use('/api/course', course);
    app.use('/api/lecture', lecture);
    app.use('/api/enroll', enroll);
    app.use('/api/post', post);
}

module.exports = routes;