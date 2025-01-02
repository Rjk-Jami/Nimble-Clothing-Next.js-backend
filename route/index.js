const express = require('express');
const router = express.Router();
const ProductsRouter = require("./ProductsRouter/ProductsRouter")
const UserRouter = require("./UserRouter/UserRouter")





router.use("/products", ProductsRouter )
router.use("/users", UserRouter )


module.exports = router