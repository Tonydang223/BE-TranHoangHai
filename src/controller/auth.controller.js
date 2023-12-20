const constants = require("../../src/config/constants");
const Userm = require("../model/user.model");
const bcrypt = require("bcrypt");
const sendEmail = require("../../src/config/sendMailer");
const jwt = require("jsonwebtoken");

class AuthController {
  async signUp(req, res, next) {
    try {
      const { email, password, username } = req.body;
      if (
        !String(password).match(constants.passwordRegex) ||
        !String(email).match(constants.emailRegex)
      ) {
        return res
          .status(400)
          .json({ msg: "Email or password is not right format" });
      }
      if (!email || !password || !username)
        return res.status(400).json({ msg: "Các trường không được để trống!" });
      const emailExisted = await Userm.findOne({ email: email });

      if (emailExisted)
        return res.status(409).json({ msg: "Tài khoản đã tồn tại!!!" });
      const user = new Userm({
        email,
        password,
        firstName: username,
      });
      const usersaved = await user.save();

      return res
        .status(200)
        .json({
          msg: "Bạn đã đăng ký thành công!",
          data: { ...usersaved._doc, password: "" },
        });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await Userm.findOne({ email });

      if (
        !String(password).match(constants.passwordRegex) ||
        !String(email).match(constants.emailRegex)
      ) {
        return res
          .status(400)
          .json({ msg: "Email or password is not right format" });
      }

      if (!user) {
        return res.status(400).json({ msg: "Người dùng không tồn tại !" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Mật khẩu của bạn không đúng ! " });
      }

      const accessToken = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("rf_token", refresh_token, {
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
        secure: true,
        sameSite: "none",
      });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1days
        secure: true,
        sameSite: "none",
      });
      res.cookie("logged_in", true, {
        path: "/",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1days
      });

      const userInfo = { ...user._doc };
      delete userInfo.password;

      res.status(200).json({
        msg: "Đăng nhập thành công !",
        access_token: accessToken,
        user: userInfo,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async refreshToken(req, res) {
    try {
      const { rf_token } = req.cookies;
      if (!rf_token)
        return res.status(400).json({ msg: "Hãy đăng nhập lại lần nữa !" });
      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) {
            console.log("loi");
            return res.status(400).json({ msg: "Hãy đăng nhập lại lần nữa !" });
          }

          const access_token = createAccessToken({ id: result.id });
          const user = await Userm.findOne({ _id: result.id });

          res.cookie("access_token", access_token, {
            httpOnly: true,
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1days
            secure: true,
            sameSite: "none",
          });
          res.cookie("logged_in", true, {
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1days
          });

          res.status(200).json({
            mgs: "success!",
            access_token,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("rf_token", {
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true
      });
      res.clearCookie("access_token", {
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true
      });
      res.clearCookie("logged_in", {
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true
      });

      res.status(200).json({ msg: "Đăng xuất thành công !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async forgotPass(req, res, next) {
    try {
      const { email } = req.body;
      const user = await Userm.findOne({ email: email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "Email is not existed!!!", status: "fail" });
      const token = await jwt.sign(
        { _id: user._doc._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const url = `${process.env.API_URL}/api/auth/resetPass/${user._doc._id}/${token}`;
      const contentMail =
        "You click the below button to complete changing your new password.";
      const titleMail = "Changing a new password";
      sendEmail.emailActive(
        email,
        url,
        "Reset Password Here",
        contentMail,
        titleMail
      );
      res
        .status(200)
        .json({ msg: "Send the link to your email successfully!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
  async resetPass(req, res, next) {
    try {
      const { uid, token } = req.params;
      const usr = await Userm.findById({ _id: uid });
      if (usr) {
        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET,
          async function (err, data) {
            const message = "The link was expired. Please send the link again!";
            if (err) {
              return res.status(404).render("error", { message });
            }
            return res
              .status(200)
              .render("ForgotPassword", {
                email: usr.email,
                uid,
                token,
                oldPass: usr.password,
              });
          }
        );
      } else {
        const message = "The user was not found. You try to send again!";
        return res.status(404).render("error", { message });
      }
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  }
  async changePassword(req, res, next) {
    try {
      const { password } = req.body;
      const { uid, token } = req.params;
      const usr = await Userm.findById({ _id: uid });
      if (!token) return res.status(404).render("error", { message });
      if (!password || !String(password).match(constants.passwordRegex))
        return res
          .status(400)
          .json({ msg: `Password's format is not correct!!!` });

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!decoded) return res.status(404).render("error", { message });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const oldPass = await bcrypt.compareSync(password, usr.password);

      if (oldPass) return res.status(400).json({ msg: "The password is old!" });

      await Userm.findByIdAndUpdate(
        { _id: decoded._id },
        { $set: { password: hashPassword } },
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: "Your password was changed successfully!", isOk: true });
    } catch (error) {
      return res.status(500).send({ msg: error.message });
    }
  }
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = new AuthController();
