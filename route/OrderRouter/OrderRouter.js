const express = require('express');
const { getOrderedProducts } = require('../../controller/OrderController');
const { authMiddleWare } = require('../../middleware/AuthMiddleWare');
const router = express.Router();

router.post("/orderedProducts",authMiddleWare, getOrderedProducts)

module.exports = router;