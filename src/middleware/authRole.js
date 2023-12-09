const { ROLES } = require("../config/constants")
const Usrm = require('../model/user.model')

const verifyRole = (role) => {
    return async function (req, res, next) {
        try {
            if(!ROLES.includes(role)) return res.status(404).json({mgs: 'Not found role!'});

            const user = await Usrm.findOne({_id: req.usr.id});

            if(user._doc.role !== role) return res.status(404).json({mgs: 'The permission is denied!'});

            next();
        } catch (error) {
            res.status(500).json({msg: err.message});
        }
    }
}

module.exports = verifyRole;