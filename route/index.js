const express = require('express');
const router = express.Router();
const ProductsRouter = require("./ProductsRouter/ProductsRouter")
const UserRouter = require("./UserRouter/UserRouter")
const PaymentRouter = require("./PaymentRouter/PaymentRouter")




router.use("/products", ProductsRouter )
router.use("/users", UserRouter )
router.use("/payment", PaymentRouter)


module.exports = router