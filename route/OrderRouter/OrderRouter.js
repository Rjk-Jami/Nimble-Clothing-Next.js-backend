const express = require('express');
const { getOrderedProductsDetails, getOrderedProducts } = require('../../controller/OrderController');
const { authMiddleWare } = require('../../middleware/AuthMiddleWare');
const router = express.Router();

router.post("/orderedProductsDetails",authMiddleWare, getOrderedProductsDetails)
router.post("/orderedProducts",authMiddleWare, getOrderedProducts)

module.exports = router;