
const sendToken = require("../../utils/sendToken");
const refreshToken = async (req, res, next) => {
  try {
   const validUser = req.user
    // console.log(validUser, "refreshToken")
    const payload = {
      _id: validUser?._id,
      email: validUser?.email,
      name: validUser?.name,
      phone: validUser?.phone,
      avatar: validUser?.avatar,
    };
    // console.log(payload, "payload refreshToken ")
     sendToken(payload, 200, res, next);
  } catch (error) {

  }
};

module.exports = { refreshToken };
