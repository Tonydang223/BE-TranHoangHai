const jwt = require("jsonwebtoken");

async function userGuard(req, res, next) {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token)
      return res.status(401).json({ message: "Please login again !" });

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async function (err, data) {
        if (err)
          return res
            .status(401)
            .json({
              message: "The token was exired! You need to log in again.",
            });

        req.usr = data;
        next();
      }
    );
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
module.exports = { userGuard };
