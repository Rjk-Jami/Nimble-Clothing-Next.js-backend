const jwt = require("jsonwebtoken");
const { redis } = require("../Database/ConnectRedis");

const authMiddleWare = async (req, res, next)=>{
try {
    const token = req.cookies.refreshToken  
    console.log(token, "token authMiddleWare")
     
      const decode = jwt.verify(token, process.env.JWT_SECRET_REFRESH)
      if (!decode){
        return res
            .status(400)
            .send({ success: false, message: "Unauthorized Access" });
      }
      const validUser = await redis.get(`"${decode._id}"`);
      console.log(validUser, "validUser authMiddleWare")
      if (!validUser){
        return res
            .status(400)
            .send({ success: false, message: "could not refresh token" });
      } 
      req.user = validUser;
      next()
} catch (error) {
    next(error)
}

}

module.exports = {authMiddleWare}