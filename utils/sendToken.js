const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res, next) => {
  try {
    const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN);
    const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN);
    const payload = {
      email: user.email,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: `${accessTokenExpires}m`,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: `${refreshTokenExpires}d`,
    });

    const accessTokenCookieOptions = {
      expires: new Date(Date.now() + accessTokenExpires * 60 * 60 * 1000),
      maxAge: accessTokenExpires * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
    const refreshTokenCookieOptions = {
      expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
      maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
    res.status(statusCode).send({ success: true, user, accessToken});
  } catch (error) {
    next(error);
  }
};
module.exports = sendToken;
