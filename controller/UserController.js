const { UserModel } = require("../model/UsersModel");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendmail");
const sendToken = require("../utils/sendToken");
const bcrypt = require("bcryptjs");
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
        .status(409)
        .send({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(email, 15);

    const newUserRequest = await UserModel({
      email,
      name: email.split("@")[0],
      // testing purpose
      password: hashedPassword,
      isVerified: true,
      //  testing purpose
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

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // for dev
    // await sendMail(email, "Set Your Password", resetLink);

    console.log(user, "user");
    const payload = {
      _id: user?._id,
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      avatar: user?.avatar,
      isVerified: user?.isVerified,
    };
    await redis.set(user._id, JSON.stringify(payload));
    sendToken(payload, 201, res, next);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    if(!req.body.user._id){
     return res.status(404).send({ success: false, message: "user _id is not found" });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    console.log(req.cookies, "logout");
    console.log(req.body.user._id, "logout");
    const result = await redis.del(`"${req.body.user._id}"`);
    if(!result){
      return res.status(404).send({ success: false, message: "user is not found" });
     }
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

    const hashedPassword = await bcrypt.hash(resetPassword, 15);
    console.log(hashedPassword, "hashedPassword");

    user.password = hashedPassword;

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
        .status(404)
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
        .status(401)
        .send({ success: false, message: "Invalid password!" });
    }
    console.log(existingUser, "login");

    const payload = {
      _id: existingUser?._id,
      email: existingUser?.email,
      phone: existingUser?.phone,
      name: existingUser?.name,
      avatar: existingUser?.avatar,
      isVerified: existingUser?.isVerified,
    };
    await redis.set(payload._id, JSON.stringify(payload));
    sendToken(payload, 200, res, next);
  } catch (error) {}
};

// update user details
const updateUser = async (req, res, next) => {
  try {
    const { userDetails } = req.body;
    console.log(userDetails, "userDetails");

    const validUser = req.user;
    console.log(validUser, "validUser");

    const existingUser = await UserModel.findById(validUser._id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    if (existingUser?.isVerified === false) {
      return res.status(404).json({
        success: false,
        isVerified: false,
        message: "Please go for reset password",
      });
    }

    console.log(existingUser, "existingUser");

    // If no old password is provided, update only name and phone
    if (!userDetails.oldPassword) {
      console.log("Updating name and phone only...");
      existingUser.name = userDetails?.myName || existingUser.name;
      existingUser.phone = userDetails?.myPhone || existingUser.phone;
      await existingUser.save();
    } else {
      // If old password is provided, new password and confirm password must also be provided
      if (!userDetails.newPassword || !userDetails.confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "New and confirm passwords are required!",
        });
      }

      // Verify old password
      const isPasswordCorrect = await bcrypt.compare(
        userDetails.oldPassword,
        existingUser.password
      );
      console.log(isPasswordCorrect, "isPasswordCorrect");

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          isValid: false,
          message: "Invalid old password!",
        });
      }

      // Hash and update password
      const hashedPassword = await bcrypt.hash(userDetails.newPassword, 15);
      console.log(hashedPassword, "hashedPassword");

      existingUser.password = hashedPassword;
      await existingUser.save();
    }

    // Prepare updated user payload
    const payload = {
      _id: existingUser._id,
      email: existingUser.email,
      phone: existingUser.phone,
      name: existingUser.name,
      avatar: existingUser.avatar,
      isVerified: existingUser.isVerified,
    };

    // Store updated user info in Redis cache
    await redis.set(payload._id, JSON.stringify(payload));

    // Send updated user details with a new token
    return res.status(200).send({
      success: true,
      user: payload,
      message: "User details updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .send({ success: false, message: "email is required" });
  }
  const existingUser = await UserModel.findOne({ email });
  const payloadForToken = {
    _id: existingUser?._id,
  };
  if (!existingUser) {
    return res.status(400).send({ success: false, message: "User not found!" });
  }
  const token = jwt.sign(payloadForToken, process.env.JWT_SECRET_SETPASS, {
    expiresIn: "1h",
  });
  // console.log(token)

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendMail(email, "Set Your Password", resetLink);
  console.log(email, "email");
  return res
    .status(200)
    .send({ success: true, message: "Password reset link sent to email", token });
};

module.exports = {
  register,
  logout,
  resetPassword,
  login,
  updateUser,
  forgotPassword,
};
