const { UserModel } = require("../model/UsersModel");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendmail");
const sendToken = require("../utils/sendToken");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  const { emailForRegister: email } = req.body;
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
    await newUser.save();
    const payload = {
      email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_SETPASS, {
      expiresIn: "1h",
    });
    // console.log(token)

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const body = `<p>Hello,</p>
        <p>You requested to set your password. Click the link below to set your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>`;

    await sendMail(email, "Set Your Password", body);

    sendToken(payload, 200, res, next);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    console.log(req.cookies);
    res.status(200).send({ success: true, message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { resetPassword } = req.body;
  const { token } = req.params;
  console.log(resetPassword, "resetPassword");
  console.log(token, "token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_SETPASS);
    console.log(decoded.email, "decoded");
    const user = await UserModel.findOne({ email: decoded.email });
    console.log(user, "user");
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    if (user.passwordTokenUsed) {
      return res
        .status(400)
        .send({ success: false, message: "Token already used" });
    }

    const hashedPassword = await bcrypt.hash(resetPassword, 15);
    console.log(hashedPassword, "hashedPassword");
    user.password = hashedPassword;
    user.passwordTokenUsed = true;
    user.isVerified = true;
    await user.save();
    res
      .status(200)
      .send({ success: true, message: "Password has been set successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email,password, "login");
  if (!email) {
    return res
      .status(400)
      .send({ success: false, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .send({ success: false, message: "Password is required" });
  }
  try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
          return res
            .status(400)
            .send({ success: false, message: "User not found!" });
        }
        if (!existingUser.isVerified) {
          return res
            .status(400)
            .send({ success: false, message: "Please Set a password!" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        console.log(isPasswordCorrect, "isPasswordCorrect")
        if (!isPasswordCorrect) {
          return res
            .status(400)
            .send({ success: false, message: "Invalid password!" });
        }
        const payload = {
            _id: existingUser?._id,
            email:existingUser?.email,
            name:existingUser?.name,
            avatar:existingUser?.avatar
        }
        sendToken(payload, 200, res, next);
  } catch (error) {
    
  }

  
}
module.exports = { register, logout, resetPassword,login };
