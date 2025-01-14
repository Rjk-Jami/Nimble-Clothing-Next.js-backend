const express = require('express');
const { MakePayment, Purchase } = require('../../components/MakePayment/MakePayment');
const router = express.Router();

router.post("/create-payment-intent", MakePayment)
router.post("/purchase", Purchase)


module.exports = router;