const { uploads } = require("../config/cloudinary");
const Usrm = require("../model/user.model");
const fs = require("fs");
const constants = require("../../src/config/constants");
const bcrypt = require('bcrypt');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const allusers = await Usrm.find().sort("-createdAt");
      return res.status(200).send({ msg: "take all users ok", data: allusers });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async getInfoUsr(req, res, next) {
    try {
      const user = await Usrm.findOne({ _id: req.usr.id }).select("-password");
      res
        .status(200)
        .json({ msg: "take info successfully", data: { user: user } });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async editInfo(req, res, next) {
    try {
      const user = { ...req.body };
      const newUsr = await Usrm.findOneAndUpdate(
        { _id: req.usr.id },
        { $set: user },
        { new: true }
      );
      res.status(200).json({ msg: "Update successfully!", data: newUsr });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async updatePass(req, res, next) {
    try {
      const { confirm, password, new_password } = req.body;
      if (
        !password ||
        !new_password ||
        !String(password).match(constants.passwordRegex) ||
        !String(new_password).match(constants.passwordRegex) ||
        password !== confirm
      )
        return res
          .status(400)
          .json({ msg: `Password's format is not correct or not match!!!` });

      const usr = await Usrm.findOne({_id: req.usr.id})

      const salt = await bcrypt.genSalt(10);
      const oldPass = await bcrypt.compareSync(password, usr.password);
      const hashPassword = await bcrypt.hash(new_password, salt);


      if (!oldPass) return res.status(400).json({ msg: "The password is not match!" });

      await Usrm.findByIdAndUpdate(
        { _id:  req.usr.id},
        { $set: { password: hashPassword } },
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: "Mật khẩu đã được thay đổi!", isOk: true });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async uploadImgProfile(req, res, next) {
    try {
      if (!req.file)
        return res.status(400).json({ msg: "The file is not found!" });

      const link = await uploads(req.file.path, "avatar");
      const usr = await Usrm.findOneAndUpdate(
        { _id: req.usr.id },
        {
          $set: {
            thumbnail: {
              public_id: link.id,
              url: link.url,
            },
          },
        },
        { new: true }
      );

      if (usr) {
        fs.unlinkSync(req.file.path);
      }

      res
        .status(200)
        .json({
          msg: "Update successfully!",
          data: { ...usr._doc, password: "" },
        });
      return res.status(200).json({ msg: "Upload ok" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async blockUsr(req, res, next) {
    try {
      const user = await Usrm.findOne({ _id: req.params.id });

      if (!user) return res.status(404).json({ mgs: "User not found!" });

      const blockUser = await Usrm.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            isBlocked: true,
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({
          msg: "Blocked the user successfully!",
          data: { ...blockUser._doc, password: "" },
        });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async unBlockUsr(req, res, next) {
    try {
      const user = await Usrm.findOne({ _id: req.params.id });

      if (!user) return res.status(404).json({ msg: "User not found!" });

      const blockUser = await Usrm.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            isBlocked: false,
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({
          msg: "Unblocked the user successfully!",
          data: { ...blockUser._doc, password: "" },
        });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new UserController();
