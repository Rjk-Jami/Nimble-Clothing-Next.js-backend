const express = require('express');
const { getOrderedProductsDetails, getOrderedProducts, getSingleOrderedProducts } = require('../../controller/OrderController');
const { authMiddleWare } = require('../../middleware/AuthMiddleWare');
const router = express.Router();

router.post("/orderedProductsDetails",authMiddleWare, getOrderedProductsDetails)
router.post("/orderedProducts",authMiddleWare, getOrderedProducts)
router.get("/singleOrderedProducts/:id", getSingleOrderedProducts)

module.exports = router;