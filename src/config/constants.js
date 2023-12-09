const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,:+;]).{8,}$/
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const ROLES = [0, 1];
const TYPE_COMMENT = ['product', 'course'];
module.exports = {passwordRegex, emailRegex, ROLES, TYPE_COMMENT}