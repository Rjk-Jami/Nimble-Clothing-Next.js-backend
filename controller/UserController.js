const { UserModel } = require("../model/UsersModel");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendmail");
const sendToken = require("../utils/sendToken");
const register = async (req, res, next) => {
  const {email} = req.body;
  console.log(email);

  if (!email) {
    return res
      .status(400)
      .send({ success: false, message: "Email is required" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "User already exists" });
    }
    const newUser = await UserModel({ email });
    // await newUser.save();

    const token = jwt.sign({email}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token)
    
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    
    const body = `<p>Hello,</p>
        <p>You requested to set your password. Click the link below to set your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>`

    await sendMail(email, "Set Your Password", body);
    const payload = {
      email: email,
      
    };
    sendToken(payload,200,res, next )
    
    

  } catch (error) {
    next(error);

  }
};

module.exports = { register };
