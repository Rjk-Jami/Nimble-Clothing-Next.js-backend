const { UserModel } = require("../model/UsersModel");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendmail");
const sendToken = require("../utils/sendToken");
const bcrypt = require("bcrypt");
const { redis } = require("../Database/ConnectRedis");
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
    const newUserRequest = await UserModel({
      email,
      name: email.split("@")[0],
    });
    await newUserRequest.save();
    const user = await UserModel.findOne({ email });
    const payloadForToken = {
      _id: user._id,
    };

    const token = jwt.sign(payloadForToken, process.env.JWT_SECRET_SETPASS, {
      expiresIn: "1h",
    });
    // console.log(token)

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const body = ` <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Password Reset Request</title> </head> <body> <div style="background-color: #f3f3f3; padding: 20px;"> <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> <h2 style="background-color: #6a1b9a; color: #ffffff; padding: 10px; border-radius: 8px 8px 0 0; margin: 0;">Password Reset Request</h2> <div style="padding: 20px;"> <p>Hi ${email},</p> <p>Someone has requested a new password for the following account on Volcano BD:</p> <p><strong>Username:</strong> ${email}</p> <p>If you didn't make this request, just ignore this email. If you'd like to proceed:</p> <p><a href="${resetLink}" style="color: #6a1b9a; text-decoration: none;">Click here to reset your password</a></p> <p>Thanks for reading.</p> </div> </div> <p style="text-align: center; color: #888888; font-size: 12px;">Nimble ware — Built with <a href="http://localhost:3000/" style="color: #6a1b9a; text-decoration: none;">WooCommerce</a></p> </div> </body> </html> `;

    await sendMail(email, "Set Your Password", body);

    console.log(user, "user");
    const payload = {
      _id: user?._id,
      email: user?.email,
      name: user?.name,
      avatar: user?.avatar,
    };
    await redis.set(user._id, JSON.stringify(payload));
    sendToken(payload, 200, res, next);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    console.log(req.cookies, "logout");
    console.log(req.body.user._id, "logout");
    await redis.del(`"${req.body.user._id}"`);
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

    console.log(decoded._id, "decoded");

    const user = await UserModel.findOne({ _id: decoded._id });
    console.log(user, "user");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // if (user.passwordTokenUsed) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Token already used" });
    // }

    const hashedPassword = await bcrypt.hash(resetPassword, 15);
    console.log(hashedPassword, "hashedPassword");

    user.password = hashedPassword;
    user.passwordTokenUsed = true;
    user.isVerified = true;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password has been set successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password, "login");
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
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    console.log(isPasswordCorrect, "isPasswordCorrect");
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid password!" });
    }
    const payload = {
      _id: existingUser?._id,
      email: existingUser?.email,
      name: existingUser?.name,
      avatar: existingUser?.avatar,
    };
    sendToken(payload, 200, res, next);
  } catch (error) {}
};
module.exports = { register, logout, resetPassword, login };
