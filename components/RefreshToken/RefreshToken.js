const { redis } = require("../../Database/ConnectRedis");
const jwt = require("jsonwebtoken")
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    console.log( token, "refreshLog");
    const decode = jwt.verify(token, process.env.JWT_SECRET_REFRESH)
    if (!decode) throw error("invalid token", 400);
    // console.log(decode._id)
    const validUser = await redis.get(`"${decode._id}"`);
    if (!validUser)
        return res
          .status(400)
          .send({ success: false, message: "could not refresh token" });
    console.log(validUser, "validUser")
  } catch (error) {

  }
};

module.exports = { refreshToken };
