const express = require('express');
const router = express.Router();
const ProductsRouter = require("./ProductsRouter/ProductsRouter")
const UserRouter = require("./UserRouter/UserRouter")
const PaymentRouter = require("./PaymentRouter/PaymentRouter")
const OrderRouter = require("./OrderRouter/OrderRouter");
const { authMiddleWare } = require('../middleware/AuthMiddleWare');
const { healthCheck } = require('../components/healthCheck/healthCheck');

 


router.use("/products", ProductsRouter )
router.use("/users", UserRouter )
router.use("/payments", PaymentRouter)
router.use("/order", OrderRouter)
router.get("/health", healthCheck)


module.exports = router