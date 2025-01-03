const app = require("./app");
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const connectDatabase = require("./Database/ConnectDatabase");
const router = require("./route");
const cookieParser = require("cookie-parser");
const port = process.env.SERVER_PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb ", extended: true }));
app.use(cookieParser());
// const refreshTokenCookieOptions = {
//   expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//   maxAge: 2 * 24 * 60 * 60 * 1000,
//   httpOnly: true,
//   sameSite: "none",
//   secure: true,
// }
app.use("/api/v1", router);
// app.get("/", (req, res) => {
//   res.cookie("test", "test",refreshTokenCookieOptions);
//   res.cookie("jami", "sjkdahdkjsahdkjashdjkashdkajshdsakjdhsakdjh",refreshTokenCookieOptions);
//   res.send("Hello World!");
// });
app.get("/check-cookies", (req, res) => {
  console.log(req.cookies);

  res.send(req.cookies);
});

app.listen(port, async () => {
  await connectDatabase();
  console.log(`Example app listening on port ${port}`);
});
