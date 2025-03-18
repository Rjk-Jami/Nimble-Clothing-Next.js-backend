const jwt = require("jsonwebtoken");
const { redis } = require("../Database/ConnectRedis");

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    // console.log(token, "token");
    if (!token) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized Access : No token" });
    }
    // console.log(token, "token authMiddleWare");

    let decode;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    } catch (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access: Invalid or expired token",
      });
    }

    // console.log(decode, "decode");

    if (!decode || !decode._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access: Invalid token payload",
      });
    }
    const validUser = await redis.get(`"${decode._id}"`);
    // console.log(validUser, "validUser authMiddleWare");
    if (!validUser) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized Access: Invalid user" });
    }
    req.user = validUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleWare };
